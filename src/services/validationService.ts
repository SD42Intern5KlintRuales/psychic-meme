import type { ValidationResponse } from "../types/validation";
import { apiClient } from "./apiClient";

export async function validateBatch(
    excelFiles: File[],
    rulesFile: File,
    reviewerName?: string
): Promise<ValidationResponse> {
    const formData = new FormData();

    excelFiles.forEach((file) => formData.append("excelFiles", file));
    formData.append("rulesFile", rulesFile);
    if (reviewerName && reviewerName.trim()) {
        formData.append("reviewerName", reviewerName.trim());
    }
    
    const response = await apiClient.post<ValidationResponse>(
        "/api/excel/validate-batch",
        formData
    );

    return response.data;
}
