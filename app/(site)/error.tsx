"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for your error reporting service when you have one.
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1
        className="display mt-5 text-4xl sm:text-5xl"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        We dropped that one
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
        An unexpected error stopped this page loading. Try again — and if it keeps happening,
        message us and we will sort it out.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
