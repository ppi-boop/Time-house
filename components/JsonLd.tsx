/**
 * Renders one or more schema.org nodes as a single @graph block.
 * Server component — the JSON never reaches the client bundle.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const graph = Array.isArray(schema) ? schema : [schema];
  const payload = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: it is built from our own typed data.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
