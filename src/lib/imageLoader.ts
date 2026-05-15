const R2_DOMAIN = "https://media.williampieh.com";

type LoaderArgs = { src: string; width: number; quality?: number };

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: LoaderArgs): string {
  const q = quality ?? 80;

  if (src.startsWith("https://")) {
    return `${R2_DOMAIN}/cdn-cgi/image/width=${width},quality=${q},format=auto,fit=scale-down/${src}`;
  }

  const fullUrl = `${R2_DOMAIN}${src.startsWith("/") ? src : `/${src}`}`;
  return `${R2_DOMAIN}/cdn-cgi/image/width=${width},quality=${q},format=auto,fit=scale-down/${fullUrl}`;
}
