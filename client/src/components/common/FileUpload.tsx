import { Upload, FileText } from "lucide-react";
import { useRef } from "react";

export default function FileUpload({
  currentFileName,
  onFileSelected,
  accept = ".pdf,.doc,.docx",
  maxSizeMb = 5,
}: {
  currentFileName?: string;
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!accept.split(",").includes(ext)) {
      alert(`Only ${accept} files are supported.`);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File must be smaller than ${maxSizeMb}MB.`);
      return;
    }
    onFileSelected(file);
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center">
      {currentFileName && (
        <p className="mb-2 flex items-center justify-center gap-2 text-sm text-slate-600">
          <FileText className="h-4 w-4" /> Current file: {currentFileName}
        </p>
      )}
      <button
        type="button"
        className="btn-secondary mx-auto"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        {currentFileName ? "Replace resume" : "Upload resume"}
      </button>
      <p className="mt-2 text-xs text-slate-400">
        PDF, DOC, or DOCX up to {maxSizeMb}MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
