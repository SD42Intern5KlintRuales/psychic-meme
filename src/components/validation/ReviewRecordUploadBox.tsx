import { useRef } from "react";
import type React from "react";
import { isFileSystemAccessSupported, pickReviewRecordFileHandle } from "../../utils/fileSystemApi";

export interface ReviewRecordUploadBoxProps {
    templateFile: File | null;
    setTemplateFile: React.Dispatch<React.SetStateAction<File | null>>;
    templateFileHandle: FileSystemFileHandle | null;
    setTemplateFileHandle: React.Dispatch<React.SetStateAction<FileSystemFileHandle | null>>;
}

const ReviewRecordUploadBox = ({
    templateFile,
    setTemplateFile,
    templateFileHandle,
    setTemplateFileHandle
}: ReviewRecordUploadBoxProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const hasNativePicker = isFileSystemAccessSupported();

    const handleClickBox = async () => {
        if (hasNativePicker) {
            const res = await pickReviewRecordFileHandle();
            if (res) {
                setTemplateFile(res.file);
                setTemplateFileHandle(res.handle);
                return;
            }
        }
        // Fallback to standard input click
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setTemplateFile(file);
            setTemplateFileHandle(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0] ?? null;
        if (file && (file.name.endsWith(".xlsm") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            setTemplateFile(file);
            setTemplateFileHandle(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTemplateFile(null);
        setTemplateFileHandle(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Review Record Template (.xlsm - Optional)
            </label>
            <div
                onClick={handleClickBox}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all min-h-[160px] ${
                    templateFile
                        ? "border-purple-400 bg-purple-50/50"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsm,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {templateFile ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg mb-2">
                            📋
                        </div>
                        <p className="font-semibold text-slate-800 text-sm max-w-[200px] truncate">
                            {templateFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {(templateFile.size / 1024).toFixed(1)} KB
                        </p>

                        {templateFileHandle && (
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                ⚡ Direct Disk Sync Active
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={handleRemove}
                            className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                        >
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-2 text-base">
                            +
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                            Upload Review Record Template
                        </p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                            {hasNativePicker
                                ? "Click to pick local file for Direct Disk Sync, or drop template here."
                                : "Optional custom template (.xlsm). Defaults to standard Review Record template."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewRecordUploadBox;
