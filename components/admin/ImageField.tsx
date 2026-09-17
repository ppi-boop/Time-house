"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaShape } from "@/lib/admin/media";

/**
 * Picture fields for the admin forms.
 *
 * The shop chooses a file, it uploads straight away, and the address it comes
 * back with is kept in a hidden input — so the surrounding form still posts
 * plain text to the same server action, and pasting an address by hand still
 * works for anything already hosted elsewhere.
 */

async function upload(file: File, shape: MediaShape): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("shape", shape);

  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "The upload failed.");
  return json.url as string;
}

const previewShape: Record<MediaShape, string> = {
  product: "aspect-4/5",
  square: "aspect-square",
  wide: "aspect-video",
  logo: "aspect-video",
};

/** Several pictures, in order — the product gallery. */
export function ImageListField({
  name,
  label,
  initial,
  shape = "product",
  hint,
}: {
  name: string;
  label: string;
  initial: string[];
  shape?: MediaShape;
  hint?: string;
}) {
  const [images, setImages] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) added.push(await upload(file, shape));
      setImages((current) => [...current, ...added]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function move(index: number, by: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + by;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      {/* What the form actually posts: one address per line, unchanged. */}
      <input type="hidden" name={name} value={images.join("\n")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs tracking-[0.12em] text-fg-muted uppercase">{label}</span>
        <span className="text-xs text-fg-subtle">
          {images.length} {images.length === 1 ? "picture" : "pictures"}
        </span>
      </div>

      {images.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className="overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-2"
            >
              <span className={cn("relative block bg-surface-3", previewShape[shape])}>
                <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                {index === 0 && (
                  <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[0.625rem] tracking-[0.1em] text-on-brand uppercase">
                    Card
                  </span>
                )}
              </span>

              <div className="flex items-center justify-between gap-1 border-t border-line px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move later"
                    className="rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setImages((c) => c.filter((_, i) => i !== index))}
                  className="rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => addFiles(e.target.files)}
          className="w-full rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-surface px-3.5 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-surface-3 file:px-4 file:py-1.5 file:text-xs file:tracking-[0.1em] file:uppercase sm:w-auto sm:flex-1"
        />
        {busy && <span className="text-xs text-fg-muted">Uploading…</span>}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-accent-ink">
          {error}
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

/** One picture — a logo, a category card, the story panel. */
export function ImagePickerField({
  name,
  label,
  initial,
  shape = "square",
  hint,
}: {
  name: string;
  label: string;
  initial: string;
  shape?: MediaShape;
  hint?: string;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      setValue(await upload(files[0], shape));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0">
      <span className="text-xs tracking-[0.12em] text-fg-muted uppercase">{label}</span>

      <div className="mt-2 flex items-start gap-4">
        <span
          className={cn(
            "relative block w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-2",
            previewShape[shape],
          )}
        >
          {value ? (
            <Image src={value} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[0.625rem] text-fg-subtle">
              None
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => choose(e.target.files)}
            className="w-full rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-surface px-3.5 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-surface-3 file:px-4 file:py-1.5 file:text-xs file:tracking-[0.1em] file:uppercase"
          />
          {/* Still editable by hand, for a picture that already lives somewhere. */}
          <input
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="or paste an address"
            className="w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3.5 py-2 font-mono text-xs text-fg-muted focus-visible:border-accent focus-visible:outline-none"
          />
          {busy && <p className="text-xs text-fg-muted">Uploading…</p>}
          {error && (
            <p role="alert" className="text-xs text-accent-ink">
              {error}
            </p>
          )}
          {hint && <p className="text-xs text-fg-subtle">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
