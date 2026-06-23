import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

interface DownloadCardProps {
  title: string;
  description: string;
  type: string;
  languages: string[];
  href: string;
  icons?: Record<string, ResolvedIcon>;
}

export default function DownloadCard({
  title,
  description,
  type,
  languages,
  href,
  icons = {},
}: DownloadCardProps) {
  return (
    <div className="group flex items-start gap-5 p-6 bg-light-gray hover:bg-anthracite transition-all duration-500">
      {/* PDF icon */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pumpkin/10 text-pumpkin group-hover:bg-pumpkin group-hover:text-white transition-all duration-500">
        <CmsIcon icon={icons["download-pdf"]} width={22} height={22} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-anthracite text-base font-bold group-hover:text-white transition-colors duration-500 mb-1">
          {title}
        </h3>
        <p className="font-body text-text-gray text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-500 mb-3">
          {description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border border-anthracite/15 text-text-muted group-hover:border-white/20 group-hover:text-white/70 transition-colors duration-500">
            {type}
          </span>
          {languages.map((lang) => (
            <span
              key={lang}
              className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border border-anthracite/15 text-text-muted group-hover:border-white/20 group-hover:text-white/70 transition-colors duration-500"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-4 py-2 bg-pumpkin/10 text-anthracite hover:bg-pumpkin hover:text-white transition-all duration-300"
          >
            Ansehen
          </a>
          <a
            href={href}
            download
            className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-4 py-2 border border-anthracite/15 text-text-muted hover:bg-pumpkin hover:border-pumpkin hover:text-white group-hover:border-white/20 group-hover:text-white/70 group-hover:hover:bg-pumpkin group-hover:hover:border-pumpkin group-hover:hover:text-white transition-all duration-300"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
