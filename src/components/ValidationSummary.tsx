import { Card } from "@mui/material";
import type { FileValidationResult } from "../types/validation";

interface ValidationSummaryProps {
    result: FileValidationResult;
}

const ValidationSummary = ({ result }: ValidationSummaryProps) => {
    const statusColor = result.status === "PASSED" ? "text-emerald-600" : "text-rose-600";

    return (
        <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Validation Summary</h2>
                {result.reviewerName && (
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span>Reviewer: <strong>{result.reviewerName}</strong></span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="p-5 bg-white rounded-3xl shadow-sm">
                    <div className="text-slate-500">Overall Status</div>
                    <div className={`text-2xl font-bold mt-3 ${statusColor}`}>{result.status}</div>
                </Card>

                <Card className="p-5 bg-white rounded-3xl shadow-sm">
                    <div className="text-slate-500">Total Checks</div>
                    <div className="text-2xl font-bold mt-3">{result.totalChecks}</div>
                </Card>

                <Card className="p-5 bg-white rounded-3xl shadow-sm">
                    <div className="text-slate-500">Passed Checks</div>
                    <div className="text-2xl font-bold mt-3 text-emerald-600">{result.passedChecks}</div>
                </Card>

                <Card className="p-5 bg-white rounded-3xl shadow-sm">
                    <div className="text-slate-500">Failed Checks</div>
                    <div className="text-2xl font-bold mt-3 text-rose-600">{result.failedChecks}</div>
                </Card>
            </div>
        </div>
    );
};

export default ValidationSummary;
