"use client";

import { useState, useRef, useCallback } from "react";

export default function ImageUploader({
  categorySlug,
  onUploaded,
  existingPath,
}: {
  categorySlug: string;
  onUploaded: (imagePath: string) => void;
  existingPath?: string;
}) {
  const [preview, setPreview] = useState<string | null>(existingPath || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("categorySlug", categorySlug || "misc");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        onUploaded(data.imagePath);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [categorySlug, onUploaded]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <label className="block mb-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        Design photo
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-6 transition-colors"
        style={{
          borderColor: isDraggingOver ? "var(--marigold-dark)" : "var(--thread)",
          background: isDraggingOver ? "var(--thread-light)" : "#fff",
          minHeight: preview ? "auto" : "160px",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-52 object-cover rounded-md border"
            style={{ borderColor: "var(--thread)" }}
          />
        ) : (
          <>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              Drag a photo here, or tap to browse
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              JPG, PNG, or WEBP
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs mt-2 stitch-link"
          style={{ color: "var(--teal)" }}
        >
          Choose a different photo
        </button>
      )}

      {uploading && <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>Uploading…</p>}
      {error && <p className="text-xs mt-2" style={{ color: "var(--maroon)" }}>{error}</p>}
    </div>
  );
}
