import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    Tabs,
    Tab,
    Box
} from "@mui/material";
import type { FileValidationResult } from "../types/validation";

interface FileResultsProps {
    result: FileValidationResult;
    onReset: () => void;
    onExportReviewRecord?: () => void;
    isExporting?: boolean;
    isDirectSync?: boolean;
}

const FileResults = ({ result, onReset, onExportReviewRecord, isExporting, isDirectSync }: FileResultsProps) => {
    const sheets = result.sheetValidations.sheetDetails || [];
    const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
    const [subTabIndex, setSubTabIndex] = useState(0);

    const activeSheet = sheets[selectedSheetIndex] ?? sheets[0];

    const statusClass = result.valid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">Detailed Results</h3>
                    <p className="text-sm text-slate-500 mt-1">Review validation details sheet by sheet.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {onExportReviewRecord && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            disabled={isExporting}
                            onClick={onExportReviewRecord}
                            className="border-purple-600 text-purple-700 hover:bg-purple-50"
                        >
                            {isExporting
                                ? (isDirectSync ? "Saving File…" : "Processing…")
                                : isDirectSync
                                ? "Save to Local Review Record ⚡"
                                : "Save Review Record (.xlsm)"}
                        </Button>
                    )}
                    <Button variant="contained" color="primary" onClick={onReset}>
                        Validate Another
                    </Button>
                </div>
            </div>

            <Accordion defaultExpanded={!result.valid} className="rounded-3xl border border-slate-200">
                <AccordionSummary expandIcon={<span className="text-slate-500">▼</span>}>
                    <div className="w-full flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div className="font-semibold text-slate-900">{result.fileName}</div>
                                <div className="text-sm text-slate-500">{result.fileType?.replace(/_/g, " ") ?? "Workbook"}</div>
                                {!result.valid && result.message ? (
                                    <div className="text-sm text-rose-700 mt-2 whitespace-pre-line font-medium bg-rose-50 p-3 rounded-xl border border-rose-200 shadow-sm">
                                        {result.message}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}>{result.status}</div>
                                <div className="text-sm text-slate-600">{result.passedChecks} / {result.totalChecks} checks passed</div>
                            </div>
                        </div>

                        {/* Sheet Indicators */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-2">Sheets:</span>
                            {result.sheetValidations.presentSheets.map((sheet) => (
                                <span key={sheet} className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    {sheet}
                                </span>
                            ))}
                            {result.sheetValidations.missingSheets.map((sheet) => (
                                <span key={sheet} className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                    {sheet} (Missing)
                                </span>
                            ))}
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {sheets.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500">No sheet details available for this file.</div>
                    ) : (
                        <div>
                            {/* Top Level Sheet Tabs */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={selectedSheetIndex}
                                    onChange={(_, newIndex) => {
                                        setSelectedSheetIndex(newIndex);
                                        // Auto select Failed subtab if sheet has failed fields, else Passed subtab
                                        const targetSheet = sheets[newIndex];
                                        if (targetSheet && targetSheet.failedFields.length > 0) {
                                            setSubTabIndex(0);
                                        } else {
                                            setSubTabIndex(1);
                                        }
                                    }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="sheet tabs"
                                >
                                    {sheets.map((s, idx) => {
                                        const isFailed = s.status === "FAILED" || s.status === "MISSING";
                                        const badgeColor = isFailed ? "bg-rose-500" : "bg-emerald-500";
                                        return (
                                            <Tab
                                                key={s.sheetName}
                                                label={
                                                    <div className="flex items-center gap-2">
                                                        <span>📄 {s.sheetName}</span>
                                                        <span className={`w-2 h-2 rounded-full ${badgeColor}`}></span>
                                                    </div>
                                                }
                                                id={`sheet-tab-${idx}`}
                                            />
                                        );
                                    })}
                                </Tabs>
                            </Box>

                            {/* Active Sheet Card Content */}
                            {activeSheet && (
                                <div className="pt-5 space-y-4">
                                    {/* Sheet Header Status Bar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div>
                                            <span className="text-base font-bold text-slate-800">Sheet: {activeSheet.sheetName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                                activeSheet.status === "PASSED"
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    : activeSheet.status === "MISSING"
                                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                                    : "bg-rose-100 text-rose-700 border-rose-200"
                                            }`}>
                                                {activeSheet.status}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-600">
                                                {activeSheet.passedChecks} Passed / {activeSheet.failedChecks} Failed
                                            </span>
                                        </div>
                                    </div>

                                    {/* Inner Sub-Tabs for Failed and Passed Validations */}
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                                        <Tabs
                                            value={subTabIndex}
                                            onChange={(_, newSubIndex) => setSubTabIndex(newSubIndex)}
                                            aria-label="failed passed subtabs"
                                        >
                                            <Tab
                                                label={`Failed Validations (${activeSheet.failedFields.length})`}
                                                className={activeSheet.failedFields.length > 0 ? "text-rose-600 font-bold" : ""}
                                            />
                                            <Tab
                                                label={`Passed Validations (${activeSheet.passedFields.length})`}
                                                className="text-emerald-700 font-medium"
                                            />
                                        </Tabs>
                                    </Box>

                                    {/* SubTab 0: Failed Validations */}
                                    {subTabIndex === 0 && (
                                        <div className="pt-3 space-y-3">
                                            {activeSheet.failedFields.length === 0 ? (
                                                <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-100 font-medium">
                                                    🎉 No failed validations on sheet "{activeSheet.sheetName}".
                                                </div>
                                            ) : (
                                                activeSheet.failedFields.map((err, idx) => (
                                                    <Card key={idx} className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-none">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <div className="text-xs uppercase tracking-wide text-rose-500 font-bold">Sheet</div>
                                                                <div className="text-sm font-medium text-slate-800">{err.sheet}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs uppercase tracking-wide text-rose-500 font-bold">Cell</div>
                                                                <div className="text-sm font-medium text-slate-800">{err.cell ?? "—"}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs uppercase tracking-wide text-rose-500 font-bold">Field</div>
                                                                <div className="text-sm font-medium text-slate-800">{err.field ?? "—"}</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-rose-100">
                                                            <div><span className="font-semibold text-rose-700">Error: </span><span>{err.message}</span></div>
                                                            <div className="mt-2 text-slate-600">
                                                                <span className="font-semibold">Value found: </span>
                                                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-rose-900 border border-slate-200">{err.value || " "}</span>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* SubTab 1: Passed Validations */}
                                    {subTabIndex === 1 && (
                                        <div className="pt-3 space-y-3">
                                            {activeSheet.passedFields.length === 0 ? (
                                                <div className="p-4 bg-slate-50 text-slate-500 text-sm rounded-xl border border-slate-200 italic">
                                                    No passed field validations recorded for sheet "{activeSheet.sheetName}".
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {activeSheet.passedFields.map((pass, idx) => (
                                                        <Card key={idx} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 shadow-none">
                                                            <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold mb-1">
                                                                <span>{pass.field ?? "Field"} ({pass.cell ?? "—"})</span>
                                                                <span className="text-emerald-600 text-[10px] uppercase font-bold tracking-wider">PASSED</span>
                                                            </div>
                                                            <div className="text-xs text-slate-600">
                                                                <span>Value found: </span>
                                                                <span className="font-mono bg-white px-1.5 py-0.5 rounded text-emerald-900 border border-slate-200">{pass.value || " "}</span>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default FileResults;
