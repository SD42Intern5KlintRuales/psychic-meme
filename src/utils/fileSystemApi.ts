declare global {
    interface Window {
        showOpenFilePicker?: (options?: any) => Promise<FileSystemFileHandle[]>;
    }
    interface FileSystemFileHandle {
        getFile(): Promise<File>;
        createWritable(options?: any): Promise<FileSystemWritableFileStream>;
        queryPermission?(descriptor?: { mode: "read" | "readwrite" }): Promise<PermissionState>;
        requestPermission?(descriptor?: { mode: "read" | "readwrite" }): Promise<PermissionState>;
    }
    interface FileSystemWritableFileStream {
        write(data: any): Promise<void>;
        close(): Promise<void>;
    }
}

export interface FileHandleResult {
    file: File;
    handle: FileSystemFileHandle | null;
}

export function isFileSystemAccessSupported(): boolean {
    return typeof window !== "undefined" && "showOpenFilePicker" in window;
}

export async function pickReviewRecordFileHandle(): Promise<FileHandleResult | null> {
    if (!isFileSystemAccessSupported() || !window.showOpenFilePicker) {
        return null;
    }

    try {
        const [handle] = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: "Excel Macro-Enabled Workbook (.xlsm)",
                    accept: {
                        "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm"],
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                        "application/vnd.ms-excel": [".xls"]
                    }
                }
            ]
        });

        if (!handle) return null;
        const file = await handle.getFile();
        return { file, handle };
    } catch (err: any) {
        // Handle user cancellation gracefully
        if (err && err.name === "AbortError") {
            return null;
        }
        console.warn("File System Access API picker failed or was cancelled:", err);
        return null;
    }
}

export async function writeBlobToFileHandle(
    handle: FileSystemFileHandle,
    blob: Blob
): Promise<boolean> {
    try {
        // Request write permission if needed
        if (handle.queryPermission) {
            const status = await handle.queryPermission({ mode: "readwrite" });
            if (status !== "granted") {
                if (handle.requestPermission) {
                    const requested = await handle.requestPermission({ mode: "readwrite" });
                    if (requested !== "granted") {
                        console.warn("User denied permission to write to file.");
                        return false;
                    }
                }
            }
        }

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
    } catch (err) {
        console.error("Failed to write blob to FileSystemFileHandle:", err);
        return false;
    }
}
