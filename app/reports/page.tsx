"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, RefreshCw, Calendar } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "@/lib/utils";

interface ReportCounts {
  total: number;
  total_users: number;
  returning_users: number;
  gender: Record<string, number>;
  status: Record<string, number>;
  relationship_status: Record<string, number>;
  attribute_love: Record<string, number>;
  vibe: Record<string, number>;
}

interface ReportsResponse {
  start_date: string | null;
  end_date: string | null;
  counts: ReportCounts;
}

interface TrendDataPoint {
  label: string;
  total_entries: number;
  total_users: number;
  returning_users: number;
}

interface TrendResponse {
  mode: string;
  data: TrendDataPoint[];
}

interface SourceDetail {
  source: string;
  total: number;
  sent: number;
  failed: number;
  in_progress: number;
  conversion_rate: number;
}

interface TrafficSourcesResponse {
  utm_source: Record<string, number>;
  utm_medium: Record<string, number>;
  utm_campaign: Record<string, number>;
  source_detail: SourceDetail[];
}

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
];

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<ReportsResponse | null>(null);
  const [trendMode, setTrendMode] = useState<"day" | "week">("day");
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trafficSources, setTrafficSources] = useState<TrafficSourcesResponse | null>(null);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
    } else {
      fetchReports();
      fetchTrend();
      fetchTrafficSources();
    }
  }, [router]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/reports/stats?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data: ReportsResponse = await response.json();
      setReportData(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/reports/csv?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename = "video_jobs_report";
      if (startDate && endDate) {
        filename += `_${startDate}_to_${endDate}`;
      } else if (startDate) {
        filename += `_from_${startDate}`;
      } else if (endDate) {
        filename += `_until_${endDate}`;
      }
      filename += ".csv";

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download CSV");
      console.error(error);
    }
  };

  const fetchTrafficSources = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/reports/traffic-sources?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch traffic sources");

      const data: TrafficSourcesResponse = await response.json();
      setTrafficSources(data);
    } catch (error) {
      console.error("Traffic sources fetch error:", error);
    }
  };

  const fetchTrend = async (mode: "day" | "week" = trendMode) => {
    setTrendLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("mode", mode);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/video-jobs/reports/trend?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch trend data");

      const data: TrendResponse = await response.json();
      setTrendData(data.data);
    } catch (error) {
      console.error("Trend fetch error:", error);
    } finally {
      setTrendLoading(false);
    }
  };

  const handleTrendModeChange = (mode: "day" | "week") => {
    setTrendMode(mode);
    fetchTrend(mode);
  };

  const handleFilter = () => {
    fetchReports();
    fetchTrend();
    fetchTrafficSources();
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => { fetchReports(); fetchTrend(); fetchTrafficSources(); }, 0);
  };

  // Simple bar chart component
  const BarChart = ({ data, title }: { data: Record<string, number>; title: string }) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxValue = Math.max(...entries.map(([, v]) => v), 1);

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="space-y-3">
          {entries.map(([key, value], index) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 truncate capitalize" title={key}>
                {key}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max((value / maxValue) * 100, 5)}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                >
                  <span className="text-xs text-white font-medium">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple pie chart using CSS
  const PieChart = ({ data, title }: { data: Record<string, number>; title: string }) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;

    let cumulativePercent = 0;
    const gradientParts = entries.map(([, value], index) => {
      const percent = (value / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return `${COLORS[index % COLORS.length]} ${start}% ${cumulativePercent}%`;
    });

    const gradientStyle = `conic-gradient(${gradientParts.join(", ")})`;

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded-full"
            style={{ background: gradientStyle }}
          />
          <div className="flex-1 space-y-1">
            {entries.map(([key, value], index) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="text-gray-800 font-medium ml-auto">
                  {value} ({((value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Stats card component
  const StatsCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderLeftColor: color }}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear
            </button>
            {(startDate || endDate) && (
              <div className="text-sm text-gray-500">
                Showing data {startDate && `from ${startDate}`} {endDate && `to ${endDate}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : reportData ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <StatsCard label="Total Entries" value={reportData.counts.total} color="#3B82F6" />
              <StatsCard label="Total Users" value={reportData.counts.total_users} color="#8B5CF6" />
              <StatsCard label="Returning Users" value={reportData.counts.returning_users} color="#F97316" />
              <StatsCard label="Sent" value={reportData.counts.status.sent || 0} color="#10B981" />
              <StatsCard label="Failed" value={reportData.counts.status.failed || 0} color="#EF4444" />
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <StatsCard label="Male" value={reportData.counts.gender.male || 0} color="#10B981" />
              <StatsCard label="Female" value={reportData.counts.gender.female || 0} color="#EC4899" />
              <StatsCard label="Queued" value={reportData.counts.status.queued || 0} color="#F59E0B" />
              <StatsCard label="Processing" value={(reportData.counts.status.photo_processing || 0) + (reportData.counts.status.lipsync_processing || 0)} color="#84CC16" />
              <StatsCard label="Uploaded" value={reportData.counts.status.uploaded || 0} color="#6366F1" />
              <StatsCard label="Wait" value={reportData.counts.status.wait || 0} color="#9CA3AF" />
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Trend Overview</h3>
                <select
                  value={trendMode}
                  onChange={(e) => handleTrendModeChange(e.target.value as "day" | "week")}
                  className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="day">Day Wise</option>
                  <option value="week">Week Wise</option>
                </select>
              </div>

              {trendLoading ? (
                <div className="flex items-center justify-center h-48">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : trendData.length === 0 ? (
                <div className="text-center text-gray-400 py-12">No trend data available</div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex gap-6 mb-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#3B82F6" }} />
                      <span className="text-gray-600">Total Entries</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#8B5CF6" }} />
                      <span className="text-gray-600">Total Users</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#F97316" }} />
                      <span className="text-gray-600">Returning Users</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="overflow-x-auto">
                    <div className="flex items-end gap-1" style={{ minWidth: trendData.length * 100, height: 300 }}>
                      {(() => {
                        const maxVal = Math.max(...trendData.map(d => Math.max(d.total_entries, d.total_users, d.returning_users)), 1);
                        const totalEntries = trendData.reduce((s, d) => s + d.total_entries, 0) || 1;
                        const totalUsers = trendData.reduce((s, d) => s + d.total_users, 0) || 1;
                        const totalReturning = trendData.reduce((s, d) => s + d.returning_users, 0) || 1;

                        return trendData.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center min-w-[80px]">
                            {/* Bars */}
                            <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 240 }}>
                              {/* Total Entries bar */}
                              <div className="flex flex-col items-center" style={{ width: "30%" }}>
                                <div className="text-[10px] text-gray-700 font-medium mb-0.5 whitespace-nowrap">
                                  {d.total_entries}
                                </div>
                                <div className="text-[9px] text-gray-400 mb-0.5">
                                  {((d.total_entries / totalEntries) * 100).toFixed(0)}%
                                </div>
                                <div
                                  className="w-full rounded-t"
                                  style={{
                                    height: `${Math.max((d.total_entries / maxVal) * 180, 4)}px`,
                                    backgroundColor: "#3B82F6",
                                  }}
                                />
                              </div>
                              {/* Total Users bar */}
                              <div className="flex flex-col items-center" style={{ width: "30%" }}>
                                <div className="text-[10px] text-gray-700 font-medium mb-0.5 whitespace-nowrap">
                                  {d.total_users}
                                </div>
                                <div className="text-[9px] text-gray-400 mb-0.5">
                                  {((d.total_users / totalUsers) * 100).toFixed(0)}%
                                </div>
                                <div
                                  className="w-full rounded-t"
                                  style={{
                                    height: `${Math.max((d.total_users / maxVal) * 180, 4)}px`,
                                    backgroundColor: "#8B5CF6",
                                  }}
                                />
                              </div>
                              {/* Returning Users bar */}
                              <div className="flex flex-col items-center" style={{ width: "30%" }}>
                                <div className="text-[10px] text-gray-700 font-medium mb-0.5 whitespace-nowrap">
                                  {d.returning_users}
                                </div>
                                <div className="text-[9px] text-gray-400 mb-0.5">
                                  {((d.returning_users / totalReturning) * 100).toFixed(0)}%
                                </div>
                                <div
                                  className="w-full rounded-t"
                                  style={{
                                    height: `${Math.max((d.returning_users / maxVal) * 180, 4)}px`,
                                    backgroundColor: "#F97316",
                                  }}
                                />
                              </div>
                            </div>
                            {/* Label */}
                            <div className="text-xs text-gray-500 mt-1 text-center truncate w-full" title={d.label}>
                              {d.label}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <PieChart data={reportData.counts.gender} title="Gender Distribution" />

              {/* Status Distribution */}
              <PieChart data={reportData.counts.status} title="Status Distribution" />

              {/* Relationship Status */}
              <BarChart data={reportData.counts.relationship_status} title="Relationship Status" />

              {/* Attribute Love */}
              <BarChart data={reportData.counts.attribute_love} title="What They Love" />

              {/* Vibe */}
              <BarChart data={reportData.counts.vibe} title="Vibe Distribution" />
            </div>

            {/* Traffic Sources */}
            {trafficSources && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Traffic Sources</h2>

                {/* Conversion Table per UTM Source */}
                {trafficSources.source_detail && trafficSources.source_detail.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Source-wise Conversions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-gray-500">
                            <th className="pb-2 pr-4">Source</th>
                            <th className="pb-2 pr-4 text-right">Submissions</th>
                            <th className="pb-2 pr-4 text-right">Sent</th>
                            <th className="pb-2 pr-4 text-right">Failed</th>
                            <th className="pb-2 pr-4 text-right">In Progress</th>
                            <th className="pb-2 text-right">Conversion %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trafficSources.source_detail.map((row) => (
                            <tr key={row.source} className="border-b last:border-0">
                              <td className="py-2 pr-4 font-medium text-gray-800">{row.source}</td>
                              <td className="py-2 pr-4 text-right">{row.total}</td>
                              <td className="py-2 pr-4 text-right text-green-600 font-medium">{row.sent}</td>
                              <td className="py-2 pr-4 text-right text-red-600 font-medium">{row.failed}</td>
                              <td className="py-2 pr-4 text-right text-amber-600">{row.in_progress}</td>
                              <td className="py-2 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                  row.conversion_rate >= 50 ? "bg-green-100 text-green-700" :
                                  row.conversion_rate >= 20 ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {row.conversion_rate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BarChart data={trafficSources.utm_source} title="UTM Source" />
                  <BarChart data={trafficSources.utm_medium} title="UTM Medium" />
                  <BarChart data={trafficSources.utm_campaign} title="UTM Campaign" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
