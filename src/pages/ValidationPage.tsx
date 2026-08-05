import { useState } from "react";
import { Container } from "@mui/material";
import Header from "../components/Header";
import UploadSection from "../components/UploadSection";
import ValidationSummary from "../components/ValidationSummary";
import FileResults from "../components/FileResults";
import type { FileValidationResult } from "../types/validation";
import { validateSingle, exportReviewRecord } from "../services/validationService";

const ValidationPage = () => {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [rulesFile, setRulesFile] = useState<File | null>(null);
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [templateFileHandle, setTemplateFileHandle] = useState<FileSystemFileHandle | null>(null);
    const [reviewerName, setReviewerName] = useState<string>("");
    const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isReady = Boolean(excelFile) && Boolean(rulesFile);

    const handleValidate = async () => {
        if (!isReady || !excelFile || !rulesFile) return;

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setValidationResult(null);

        try {
            const result = await validateSingle(excelFile, rulesFile, reviewerName);
            setValidationResult(result);
        } catch (error) {
            setErrorMessage("Validation failed to complete. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportReviewRecord = async () => {
        if (!isReady || !excelFile || !rulesFile) return;

        setIsExporting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await exportReviewRecord(
                excelFile,
                rulesFile,
                templateFile,
                reviewerName,
                templateFileHandle
            );

            if (res.isDirectSync) {
                setSuccessMessage(`Review Record file '${res.fileName}' was updated directly on disk!`);
            } else {
                setSuccessMessage(`Downloaded updated Review Record '${res.fileName}'.`);
            }
        } catch (error) {
            setErrorMessage("Failed to export/update Review Record file. Please check input files and try again.");
            console.error(error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleReset = () => {
        setExcelFile(null);
        setRulesFile(null);
        setTemplateFile(null);
        setTemplateFileHandle(null);
        setReviewerName("");
        setValidationResult(null);
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(false);
        setIsExporting(false);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            <Container maxWidth="lg" className="pt-10 pb-10">
                <UploadSection
                    excelFile={excelFile}
                    setExcelFile={setExcelFile}
                    rulesFile={rulesFile}
                    setRulesFile={setRulesFile}
                    templateFile={templateFile}
                    setTemplateFile={setTemplateFile}
                    templateFileHandle={templateFileHandle}
                    setTemplateFileHandle={setTemplateFileHandle}
                    reviewerName={reviewerName}
                    setReviewerName={setReviewerName}
                    onValidate={handleValidate}
                    isLoading={isLoading}
                    isExporting={isExporting}
                    isReady={isReady}
                />

                {successMessage && (
                    <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 font-semibold shadow-sm flex items-center justify-between">
                        <span>{successMessage}</span>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700 font-semibold shadow-sm">
                        {errorMessage}
                    </div>
                )}

                {validationResult && (
                    <>
                        <ValidationSummary result={validationResult} />
                        <FileResults
                            result={validationResult}
                            onReset={handleReset}
                            onExportReviewRecord={handleExportReviewRecord}
                            isExporting={isExporting}
                            isDirectSync={Boolean(templateFileHandle)}
                        />
                    </>
                )}
            </Container>
        </div>
    );
};

export default ValidationPage;
