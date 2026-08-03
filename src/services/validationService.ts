import type { FileValidationResult } from "../types/validation";
import { apiClient } from "./apiClient";
import { writeBlobToFileHandle } from "../utils/fileSystemApi";

export async function validateSingle(
    excelFile: File,
    rulesFile: File,
    reviewerName?: string
): Promise<FileValidationResult> {
    const formData = new FormData();

    formData.append("file", excelFile);
    formData.append("rules", rulesFile);
    if (reviewerName && reviewerName.trim()) {
        formData.append("reviewerName", reviewerName.trim());
    }

    const response = await apiClient.post<FileValidationResult>(
        "/api/excel/validate",
        formData
    );

    return response.data;
}

export interface ExportResult {
    isDirectSync: boolean;
    fileName: string;
}

export async function exportReviewRecord(
    excelFile: File,
    rulesFile: File,
    templateFile?: File | null,
    reviewerName?: string,
    templateFileHandle?: FileSystemFileHandle | null
): Promise<ExportResult> {
    const formData = new FormData();

    formData.append("file", excelFile);
    formData.append("rules", rulesFile);
    if (templateFile) {
        formData.append("templateFile", templateFile);
    }
    if (reviewerName && reviewerName.trim()) {
        formData.append("reviewerName", reviewerName.trim());
    }

    const response = await apiClient.post(
        "/api/excel/export-review-record",
        formData,
        {
            responseType: "blob"
        }
    );

    const blob = new Blob([response.data], {
        type: "application/vnd.ms-excel.sheet.macroEnabled.12"
    });

    const targetFileName = templateFile
        ? templateFile.name
        : `ReviewRecord_${excelFile.name.substring(0, excelFile.name.lastIndexOf(".")) || excelFile.name}.xlsm`;

    // Attempt Direct Disk Sync if a native FileSystemFileHandle is attached
    if (templateFileHandle) {
        const success = await writeBlobToFileHandle(templateFileHandle, blob);
        if (success) {
            return {
                isDirectSync: true,
                fileName: targetFileName
            };
        }
    }

    // Fallback: Standard Browser File Download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", targetFileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
        isDirectSync: false,
        fileName: targetFileName
    };
}
