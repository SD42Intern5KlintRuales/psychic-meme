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

    // Prefer server-provided filename from Content-Disposition header if present.
    let serverFileName: string | undefined = undefined;
    try {
        const contentDisp = response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'];
        if (contentDisp) {
            const match = /filename\*=UTF-8''([^;\n\r]+)|filename=\"?([^;\n\r\"]+)\"?/.exec(contentDisp);
            if (match) {
                serverFileName = decodeURIComponent(match[1] || match[2]);
            }
        }
    } catch (e) {
        // ignore parsing errors
    }

    const targetFileName = serverFileName
        ? serverFileName
        : (templateFile ? templateFile.name : 'ReviewRecord_SupportForSC066-12.xlsm');

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
