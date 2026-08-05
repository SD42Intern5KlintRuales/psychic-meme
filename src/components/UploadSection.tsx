import { Button, Card } from "@mui/material";
import ExcelUploadBox from "./validation/ExcelUploadBox";
import RulesUploadBox from "./validation/RulesUploadBox";
import type { RulesUploadBoxProps } from "../types/validation";

interface UploadSectionProps extends RulesUploadBoxProps {
    excelFiles: File[];
    setExcelFiles: React.Dispatch<React.SetStateAction<File[]>>;
    reviewerName: string;
    setReviewerName: React.Dispatch<React.SetStateAction<string>>;
    onValidate: () => void;
    isLoading: boolean;
    isReady: boolean;
}

const UploadSection = ({
    excelFiles,
    setExcelFiles,
    rulesFile,
    setRulesFile,
    reviewerName,
    setReviewerName,
    onValidate,
    isLoading,
    isReady
}: UploadSectionProps) => {
    return (
        <Card className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">Validate release documents</h2>
                    <p className="text-slate-600 mt-2 max-w-2xl">
                        Upload Excel workbooks and a validation rules JSON file in the same screen. Once the required files are ready, validate in batch.
                    </p>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isReady || isLoading}
                    onClick={onValidate}
                    className="h-12"
                >
                    {isLoading ? "Validating…" : "Validate Documents"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExcelUploadBox files={excelFiles} setFiles={setExcelFiles} />
                <RulesUploadBox rulesFile={rulesFile} setRulesFile={setRulesFile} />
            </div>
            <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reviewer Name (optional)</label>
                <input
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter reviewer name"
                    className="w-full p-2 border rounded-md bg-white"
                />
            </div>
        </Card>
    );
};

export default UploadSection;
