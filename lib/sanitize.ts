export function sanitizeURL(url: string): string {
  // Loại bỏ các ký tự điều khiển Unicode: LRI, RLI, FSI, PDI
  return url.replace(/[\u2066\u2067\u2068\u2069]/g, "");
}
