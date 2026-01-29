const BASE_API_URL =
    // "http://localhost:8000"
    "https://api.legacylens.me";

export const searchFace = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
            BASE_API_URL + "/search-face?top_k=25&similarity_threshold=0.4",
            {
                method: "POST",
                body: formData,
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (err: unknown) {
        console.log(err);
        throw err;
    }
};

export const uploadFacesZipFile = async (
    zipFile: File,
    signal?: AbortSignal
) => {
    try {
        const formData = new FormData();
        formData.append("file", zipFile);
        const res = await fetch(BASE_API_URL + "/upload-faces", {
            method: "POST",
            body: formData,
            signal: signal,
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (err: unknown) {
        console.error("Upload failed:", err);
        throw err;
    }
};

export const updateCSVrecord = async (
    file: File,
    adaNumber: string,
    phoneNumber: string,
    csvOption: string,
    signal?: AbortSignal
) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(
            BASE_API_URL +
            `/update-csv-record?ada_no=${adaNumber}&new_number=${phoneNumber}&csv_file=${csvOption}`,
            {
                method: "POST",
                body: formData,
                signal: signal,
            }
        );
        if (!res.ok) {
            return {
                status: "error",
                message: `Failed to submit. Server error: ${res.status} ${res.statusText}`,
            };
        }
        const data = await res.json();
        return {
            status: "success",
            message: data.message || "Record updated successfully",
            data: data,
        };
    } catch (err: unknown) {
        console.error("Upload failed:", err);
        const errorMessage =
            err instanceof Error
                ? err.message
                : "Unable to submit. Please check your connection and try again.";
        return {
            status: "error",
            message: errorMessage,
        };
    }
};

export const getVideoByAda = async (adaNumber: string) => {
    try {
        const response = await fetch(
            BASE_API_URL + `/get-video-url/${adaNumber}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            status: "success",
            videoUrl: data.video_url,
            adaNo: data.ada_no,
            cached: data.cached,
        };
    } catch (err: unknown) {
        console.error("Failed to fetch video:", err);
        const errorMessage = "Video Not Found"
        return {
            status: "error",
            message: errorMessage,
        };
    }
};