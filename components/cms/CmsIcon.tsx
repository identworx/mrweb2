import type { ResolvedIcon } from "@/lib/cms/icons";

interface CmsIconProps {
  icon: ResolvedIcon | undefined;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
  "aria-hidden"?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 24,
  lg: 28,
  xl: 32,
};

export default function CmsIcon({
  icon,
  fallback,
  className = "",
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: CmsIconProps) {
  const svgMarkup = icon?.svgMarkup ?? fallback ?? null;
  const mediaUrl = icon?.mediaUrl ?? null;
  const isMedia = icon?.isMedia ?? false;
  const sizeHint = icon?.sizeHint ?? "md";
  const w = width ?? SIZE_MAP[sizeHint] ?? 24;
  const h = height ?? SIZE_MAP[sizeHint] ?? 24;

  if (isMedia && mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt=""
        width={w}
        height={h}
        className={className}
        aria-hidden={ariaHidden}
        style={{ maxWidth: w, maxHeight: h }}
      />
    );
  }

  if (svgMarkup) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: w, height: h }}
        aria-hidden={ariaHidden}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    );
  }

  return null;
}
