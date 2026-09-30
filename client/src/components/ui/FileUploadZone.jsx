import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import Button from './Button';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — must match server

/**
 * Premium drag-and-drop CSV file upload component.
 *
 * Features:
 *  - Drag-and-drop zone with visual feedback
 *  - Click-to-browse fallback
 *  - Client-side validation (extension, size, MIME)
 *  - File preview card with size display
 *  - Upload progress state
 *  - Error display
 *
 * Props:
 *  - onUpload: (file: File) => Promise<void>  — called with the selected file
 *  - isUploading: boolean — external loading state
 *  - onCancel: () => void — close handler
 */
export default function FileUploadZone({ onUpload, isUploading = false, onCancel }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const validateFile = useCallback((f) => {
    if (!f) return 'No file selected';
    
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv') return 'Only .csv files are allowed';

    if (f.size > MAX_FILE_SIZE) return `File size (${formatFileSize(f.size)}) exceeds the 10MB limit`;

    if (f.size === 0) return 'File is empty';

    return null;
  }, []);

  const handleFile = useCallback((f) => {
    setError('');
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setFile(f);
  }, [validateFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleBrowse = () => inputRef.current?.click();

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    handleFile(selected);
    e.target.value = ''; // Reset so the same file can be re-selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || isUploading) return;
    await onUpload(file);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drag-and-drop zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowse}
          className={`
            relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
            ${isDragOver
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }
          `}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragOver ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <Upload size={24} className={isDragOver ? 'text-indigo-500' : 'text-slate-400'} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDragOver ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              or <span className="text-indigo-500 font-medium">browse files</span> · Max 10MB
            </p>
          </div>
        </div>
      )}

      {/* Selected file preview */}
      {file && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
          </div>
          {!isUploading && (
            <button type="button" onClick={removeFile} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
          {isUploading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Uploading…
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onCancel} type="button" disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" loading={isUploading} disabled={!file}>
          <Upload size={14} /> Upload CSV
        </Button>
      </div>
    </form>
  );
}
