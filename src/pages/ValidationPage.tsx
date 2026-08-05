import { useState } from "react";
import { Container } from "@mui/material";
import Header from "../components/Header";
import UploadSection from "../components/UploadSection";
import ValidationSummary from "../components/ValidationSummary";
import FileResults from "../components/FileResults";
import type { ValidationResponse } from "../types/validation";
import { validateBatch } from "../services/validationService";

const ValidationPage = () => {
    const [excelFiles, setExcelFiles] = useState<File[]>([]);
    const [rulesFile, setRulesFile] = useState<File | null>(null);
    const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
    const [reviewerName, setReviewerName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isReady = excelFiles.length > 0 && Boolean(rulesFile);

    const handleValidate = async () => {
        if (!isReady || !rulesFile) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setValidationResponse(null);

        try {
            const json = await validateBatch(excelFiles, rulesFile, reviewerName);
            setValidationResponse(json);
        } catch (error) {
            setErrorMessage("Validation failed to complete. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setExcelFiles([]);
        setRulesFile(null);
        setValidationResponse(null);
        setErrorMessage(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            <Container maxWidth="lg" className="pt-10 pb-10">
                <UploadSection
                    excelFiles={excelFiles}
                    setExcelFiles={setExcelFiles}
                    rulesFile={rulesFile}
                    setRulesFile={setRulesFile}
                    reviewerName={reviewerName}
                    setReviewerName={setReviewerName}
                    onValidate={handleValidate}
                    isLoading={isLoading}
                    isReady={isReady}
                />

                {errorMessage && (
                    <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                        {errorMessage}
                    </div>
                )}

                {validationResponse && (
                    <>
                        <ValidationSummary summary={validationResponse} />
                        <FileResults validationResponse={validationResponse} onReset={handleReset} />
                    </>
                )}
            </Container>
        </div>
    );
};

export default ValidationPage;
