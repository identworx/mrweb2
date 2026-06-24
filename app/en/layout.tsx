import HtmlLangOverride from "@/components/HtmlLangOverride";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLangOverride lang="en" />
      {children}
    </>
  );
}
