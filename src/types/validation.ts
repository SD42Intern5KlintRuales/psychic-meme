import type React from "react";

export interface ExcelUploadBoxProps {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface RulesUploadBoxProps {
    rulesFile: File | null;
    setRulesFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface ValidationErrorDetail {
    sheet: string;
    cell?: string;
    field?: string;
    value?: string;
    message: string;
}

export interface SheetValidationDetail {
    sheetName: string;
    status: string;
    passedChecks: number;
    failedChecks: number;
    passedFields: ValidationErrorDetail[];
    failedFields: ValidationErrorDetail[];
}

export interface SheetValidationSummary {
    sheetsChecked: number;
    presentSheets: string[];
    missingSheets: string[];
    sheetDetails?: SheetValidationDetail[];
}

export interface FieldValidationSummary {
    passedFieldChecks: number;
    failedFieldChecks: number;
    passedFields: ValidationErrorDetail[];
    failedFields: ValidationErrorDetail[];
}

export interface FileValidationResult {
    fileName: string;
    fileType?: string;
    reviewerName?: string;
    status: string;
    valid: boolean;
    message?: string;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    sheetValidations: SheetValidationSummary;
    fieldValidations: FieldValidationSummary;
}
