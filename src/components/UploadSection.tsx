import { Button, Card, TextField } from "@mui/material";
import ExcelUploadBox from "./validation/ExcelUploadBox";
import RulesUploadBox from "./validation/RulesUploadBox";
// ReviewRecordUploadBox removed: server template used for Review Record generation
import type { RulesUploadBoxProps } from "../types/validation";

interface UploadSectionProps extends RulesUploadBoxProps {
    excelFile: File | null;
    setExcelFile: React.Dispatch<React.SetStateAction<File | null>>;
    reviewerName: string;
    setReviewerName: React.Dispatch<React.SetStateAction<string>>;
    onValidate: () => void;
    isLoading: boolean;
    isExporting: boolean;
    isReady: boolean;
}

const UploadSection = ({
    excelFile,
    setExcelFile,
    rulesFile,
    setRulesFile,
    reviewerName,
    setReviewerName,
    onValidate,
    isLoading,
    isExporting,
    isReady
}: UploadSectionProps) => {
    return (
        <Card className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Validate Release Document</h2>
                    <p className="text-slate-600 mt-2 max-w-2xl text-sm">
                        Upload an Excel workbook and a validation rules JSON file. Pick a local Review Record template (.xlsm) to sync failed results directly to your local file on disk.
                    </p>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isReady || isLoading || isExporting}
                    onClick={onValidate}
                    className="h-12 px-6 rounded-xl font-semibold"
                >
                    {isLoading ? "Validating…" : "Validate Document"}
                </Button>
            </div>

            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label htmlFor="reviewer-name-input" className="block text-sm font-semibold text-slate-700 mb-1">
                    Reviewer Name (Optional)
                </label>
                <TextField
                    id="reviewer-name-input"
                    fullWidth
                    size="small"
                    placeholder="Enter reviewer name (e.g. Klint Ruales)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    variant="outlined"
                    slotProps={{
                        input: {
                            className: "bg-white rounded-xl"
                        }
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExcelUploadBox file={excelFile} setFile={setExcelFile} />
                <RulesUploadBox rulesFile={rulesFile} setRulesFile={setRulesFile} />
            </div>
        </Card>
    );
};

export default UploadSection;
