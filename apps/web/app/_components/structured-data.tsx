type JsonLdValue = Readonly<Record<string, unknown>> | readonly unknown[];

export function StructuredData({ data }: { readonly data: JsonLdValue }) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      type="application/ld+json"
    />
  );
}
