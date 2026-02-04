"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Filter, RefreshCw, ChevronLeft, ChevronRight, Edit, X, Eye, Send } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "@/lib/utils";

interface VideoJob {
  id: number;
  user_id: string;
  mobile_number: string | null;
  gender: string | null;
  attribute_love: string | null;
  relationship_status: string | null;
  vibe: string | null;
  status: string | null;
  retry_count: number | null;
  failed_stage: string | null;
  last_error_code: string | null;
  created_at: string;
  updated_at: string;
}

interface VideoJobDetail extends VideoJob {
  raw_selfie_url: string | null;
  normalized_image_url: string | null;
  lipsync_seg2_url: string | null;
  lipsync_seg4_url: string | null;
  final_video_url: string | null;
  terms_accepted: boolean | null;
  video_count: number | null;
  locked_by: string | null;
  locked_at: string | null;
}

interface FilterParams {
  status: string;
  failed_stage: string;
  user_id: string;
  mobile_number: string;
  job_id: string;
  start_date: string;
  end_date: string;
  page: number;
  page_size: number;
}

export default function VideoJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState<FilterParams>({
    status: "",
    failed_stage: "",
    user_id: "",
    mobile_number: "",
    job_id: "",
    start_date: "",
    end_date: "",
    page: 1,
    page_size: 20,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [jobDetail, setJobDetail] = useState<VideoJobDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  // Auth guard: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", filters.page.toString());
      params.append("page_size", filters.page_size.toString());

      if (filters.status) params.append("status", filters.status);
      if (filters.failed_stage) params.append("failed_stage", filters.failed_stage);
      if (filters.user_id) params.append("user_id", filters.user_id);
      if (filters.mobile_number) params.append("mobile_number", filters.mobile_number);
      if (filters.job_id) params.append("job_id", filters.job_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/list?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setJobs(data.items);
        setTotalJobs(data.total);
        setTotalPages(data.total_pages);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setMessage("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetail = async (jobId: number) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/${jobId}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setJobDetail(data);
      } else {
        toast.error("Failed to load job details", { position: "top-right", autoClose: 3000 });
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error("Failed to fetch job detail:", error);
      toast.error("Failed to load job details", { position: "top-right", autoClose: 3000 });
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) fetchJobs();
  }, [filters.page]);

  const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...(key !== "page" && { page: 1 }) }));
  };

  const handleApplyFilters = () => {
    fetchJobs();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      failed_stage: "",
      user_id: "",
      mobile_number: "",
      job_id: "",
      start_date: "",
      end_date: "",
      page: 1,
      page_size: 20,
    });
    setTimeout(() => fetchJobs(), 100);
  };

  const handleUpdateStatus = (e: React.MouseEvent, job: VideoJob) => {
    e.stopPropagation();
    setSelectedJob(job);
    setNewStatus(job.status || "");
    setShowUpdateModal(true);
  };

  const confirmUpdate = async () => {
    if (!selectedJob || !newStatus) return;

    setUpdatingJobId(selectedJob.id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/update-job?job_id=${selectedJob.id}&status=${newStatus}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Job status updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowUpdateModal(false);
        setSelectedJob(null);
        fetchJobs();
      } else {
        throw new Error(data.detail || "Failed to update job");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update job status", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUpdatingJobId(null);
    }
  };

  const cancelUpdate = () => {
    setShowUpdateModal(false);
    setSelectedJob(null);
    setNewStatus("");
  };

  const closeDetail = () => {
    setShowDetailModal(false);
    setJobDetail(null);
  };

  const [sendingVideo, setSendingVideo] = useState(false);

  const handleSendVideo = async (jobId: number) => {
    if (!confirm("Are you sure you want to send this video to the user via WhatsApp?")) return;

    setSendingVideo(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/${jobId}/send-video`,
        { method: "POST", headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Video sent successfully!", { position: "top-right", autoClose: 3000 });
        setJobDetail((prev) => prev ? { ...prev, status: "sent" } : null);
        fetchJobs();
      } else {
        toast.error(data.detail || "Failed to send video", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Send video error:", error);
      toast.error("Failed to send video", { position: "top-right", autoClose: 3000 });
    } finally {
      setSendingVideo(false);
    }
  };

  const getStatusBadgeColor = (status: string | null) => {
    if (!status) return "bg-gray-200 text-gray-700";

    const colors: Record<string, string> = {
      wait: "bg-orange-100 text-orange-700",
      queued: "bg-blue-100 text-blue-700",
      photo_processing: "bg-yellow-100 text-yellow-700",
      photo_done: "bg-green-100 text-green-700",
      lipsync_processing: "bg-yellow-100 text-yellow-700",
      lipsync_done: "bg-green-100 text-green-700",
      stitching: "bg-purple-100 text-purple-700",
      uploaded: "bg-green-100 text-green-700",
      sent: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };

    return colors[status] || "bg-gray-200 text-gray-700";
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Jobs</h1>
              <p className="text-gray-600 mt-1">{message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/reports")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                📊 Reports
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button
                onClick={fetchJobs}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="wait">Wait</option>
                    <option value="queued">Queued</option>
                    <option value="photo_processing">Photo Processing</option>
                    <option value="photo_done">Photo Done</option>
                    <option value="lipsync_processing">Lipsync Processing</option>
                    <option value="lipsync_done">Lipsync Done</option>
                    <option value="stitching">Stitching</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Failed Stage
                  </label>
                  <select
                    value={filters.failed_stage}
                    onChange={(e) => handleFilterChange("failed_stage", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">All Stages</option>
                    <option value="photo">Photo</option>
                    <option value="lipsync">Lipsync</option>
                    <option value="stitch">Stitch</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={filters.mobile_number}
                    onChange={(e) => handleFilterChange("mobile_number", e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID
                  </label>
                  <input
                    type="text"
                    value={filters.job_id}
                    onChange={(e) => handleFilterChange("job_id", e.target.value)}
                    placeholder="Enter job ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={filters.user_id}
                    onChange={(e) => handleFilterChange("user_id", e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Size
                  </label>
                  <select
                    value={filters.page_size}
                    onChange={(e) => handleFilterChange("page_size", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No jobs found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Relationship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retry Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failed Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => fetchJobDetail(job.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.mobile_number || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            job.status
                          )}`}
                        >
                          {job.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.gender || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.relationship_status || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.retry_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.failed_stage || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.updated_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchJobDetail(job.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleUpdateStatus(e, job)}
                            disabled={updatingJobId === job.id}
                            className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing page {filters.page} of {totalPages} ({totalJobs} total jobs)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("page", filters.page - 1)}
                disabled={filters.page === 1}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                  filters.page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => handleFilterChange("page", filters.page + 1)}
                disabled={filters.page === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                  filters.page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Job Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-900">
                  Job Detail {jobDetail ? `#${jobDetail.id}` : ""}
                </h2>
                <button
                  onClick={closeDetail}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {loadingDetail ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : jobDetail ? (
                <div className="p-6 space-y-6">
                  {/* Photo */}
                  {jobDetail.raw_selfie_url && (
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={jobDetail.raw_selfie_url}
                          alt="User selfie"
                          className="w-48 h-48 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                        />
                        <span
                          className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(jobDetail.status)}`}
                        >
                          {jobDetail.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {!jobDetail.raw_selfie_url && (
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No photo</span>
                      </div>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Job ID" value={`#${jobDetail.id}`} />
                    <DetailField label="User ID" value={jobDetail.user_id} mono />
                    <DetailField label="Mobile Number" value={jobDetail.mobile_number || "N/A"} />
                    <DetailField
                      label="Status"
                      value={jobDetail.status || "N/A"}
                      badge
                      badgeColor={getStatusBadgeColor(jobDetail.status)}
                    />
                    <DetailField label="Gender" value={jobDetail.gender || "N/A"} />
                    <DetailField label="Relationship" value={jobDetail.relationship_status || "N/A"} />
                    <DetailField label="Attribute Love" value={jobDetail.attribute_love || "N/A"} />
                    <DetailField label="Vibe" value={jobDetail.vibe || "N/A"} />
                    <DetailField label="Retry Count" value={String(jobDetail.retry_count || 0)} />
                    <DetailField label="Video Count" value={String(jobDetail.video_count ?? "N/A")} />
                    <DetailField
                      label="Terms Accepted"
                      value={jobDetail.terms_accepted === null ? "N/A" : jobDetail.terms_accepted ? "Yes" : "No"}
                    />
                    <DetailField label="Failed Stage" value={jobDetail.failed_stage || "-"} />
                    <DetailField label="Last Error" value={jobDetail.last_error_code || "-"} />
                    <DetailField label="Locked By" value={jobDetail.locked_by || "-"} />
                    <DetailField
                      label="Created At"
                      value={jobDetail.created_at ? new Date(jobDetail.created_at).toLocaleString() : "N/A"}
                    />
                    <DetailField
                      label="Updated At"
                      value={jobDetail.updated_at ? new Date(jobDetail.updated_at).toLocaleString() : "N/A"}
                    />
                  </div>

                  {/* Asset URLs */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Asset URLs</h3>
                    <AssetUrlField label="Raw Selfie" url={jobDetail.raw_selfie_url} />
                    <AssetUrlField label="Normalized Image" url={jobDetail.normalized_image_url} />
                    <AssetUrlField label="Lipsync Seg 2" url={jobDetail.lipsync_seg2_url} />
                    <AssetUrlField label="Lipsync Seg 4" url={jobDetail.lipsync_seg4_url} />
                    <AssetUrlField label="Final Video" url={jobDetail.final_video_url} />
                  </div>

                  {/* Send Video Button */}
                  {jobDetail.final_video_url && jobDetail.status !== "sent" && (
                    <button
                      onClick={() => handleSendVideo(jobDetail.id)}
                      disabled={sendingVideo}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {sendingVideo ? "Sending..." : "Send Video via WhatsApp"}
                    </button>
                  )}

                  {jobDetail.status === "sent" && (
                    <div className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg font-semibold text-center text-sm">
                      Video already sent
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Update Job Status</h2>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Job ID: <span className="font-semibold text-gray-900">#{selectedJob.id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Mobile: <span className="font-semibold text-gray-900">{selectedJob.mobile_number}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Status: <span className="font-semibold text-gray-900">{selectedJob.status}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select new status</option>
                  <option value="queued">Queued</option>
                  <option value="photo_processing">Photo Processing</option>
                  <option value="photo_done">Photo Done</option>
                  <option value="lipsync_processing">Lipsync Processing</option>
                  <option value="lipsync_done">Lipsync Done</option>
                  <option value="stitching">Stitching</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Updating the status will:
                </p>
                <ul className="text-sm text-yellow-700 list-disc list-inside mt-2 space-y-1">
                  <li>Increment retry_count by 1</li>
                  <li>Clear failed_stage and last_error_code</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={cancelUpdate}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdate}
                  disabled={!newStatus || updatingJobId === selectedJob.id}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingJobId === selectedJob.id ? "Updating..." : "Confirm Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AssetUrlField({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">Not available</span>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Open
        </a>
      </div>
      <p className="text-xs text-gray-600 break-all font-mono">{url}</p>
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
  badge,
  badgeColor,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
  badgeColor?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      {badge ? (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p className={`text-sm font-semibold text-gray-900 ${mono ? "font-mono text-xs break-all" : ""}`}>
          {value}
        </p>
      )}
    </div>
  );
}
