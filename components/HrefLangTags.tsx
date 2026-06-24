import { getAllAlternates } from "@/lib/i18n/routes";

interface HrefLangTagsProps {
  path: string;
  baseUrl?: string;
}

export default function HrefLangTags({ path, baseUrl = "" }: HrefLangTagsProps) {
  const alternates = getAllAlternates(path);

  return (
    <>
      {alternates.map(({ locale, href }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={`${baseUrl}${href}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${alternates[0].href}`} />
    </>
  );
}
