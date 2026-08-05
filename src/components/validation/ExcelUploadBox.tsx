import { useDropzone } from "react-dropzone";
import { Button } from "@mui/material";
import type { ExcelUploadBoxProps } from "../../types/validation";

const ExcelUploadBox = ({ file, setFile }: ExcelUploadBoxProps) => {
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        maxFiles: 1,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"]
        }
    });

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-slate-300 rounded-3xl p-5 min-h-[280px] bg-slate-50 hover:border-slate-400 transition cursor-pointer"
        >
            <input {...getInputProps()} />
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Excel document</h3>
                        <p className="text-sm text-slate-500 mt-1">Drag and drop a file or click Add file.</p>
                    </div>
                    <Button variant="outlined" size="small" onClick={(event) => { event.stopPropagation(); open(); }}>
                        {file ? "Replace file" : "Add file"}
                    </Button>
                </div>
                {!file ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-500 gap-2">
                        <div className="text-4xl">📄</div>
                        <div className="text-sm">Drag and drop or click to browse.</div>
                        <div className="text-xs text-slate-400">Accepts .xlsx and .xls files.</div>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pb-2">
                        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📄</span>
                                <div>
                                    <div className="font-medium text-slate-700">{file.name}</div>
                                    <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-slate-500 hover:text-rose-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelUploadBox;
