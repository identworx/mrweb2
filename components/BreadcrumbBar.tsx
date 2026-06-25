import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  locale?: "de" | "en";
}

export default function BreadcrumbBar({ items, locale = "de" }: BreadcrumbBarProps) {
  return (
    <div className="bg-white border-b border-black/[0.06]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-3.5">
        <Breadcrumbs items={items} locale={locale} />
      </div>
    </div>
  );
}
