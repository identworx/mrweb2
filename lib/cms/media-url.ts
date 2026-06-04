import "server-only";

interface HasUrl {
  url?: string | null;
}

export function getMediaUrl(
  asset: HasUrl | null | undefined,
  fallback: string,
): string {
  const url = asset?.url;
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/${url}`;
}
