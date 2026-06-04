import Link from "next/link";

interface FilterOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  basePath: string;
  current: string;
  options: FilterOption[];
  counts?: Record<string, number>;
}

export default function StatusFilter({ basePath, current, options, counts }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map((opt) => {
        const isActive = current === opt.value;
        const href = opt.value === "all" ? basePath : `${basePath}?status=${opt.value}`;
        const count = counts?.[opt.value];
        return (
          <Link
            key={opt.value}
            href={href}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {opt.label}
            {count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-orange-200 text-orange-900" : "bg-gray-200 text-gray-500"
              }`}>
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
