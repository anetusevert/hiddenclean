import { NextResponse, type NextRequest } from "next/server";

// 301 non-canonical hosts to www. The Railway host is NOT listed yet: add it once
// www.hiddenclean.com is attached in Railway and DNS is live at Cloudflare.
const CANONICAL = "www.hiddenclean.com";
const REDIRECT_HOSTS = new Set<string>(["hiddenclean.com"]);

export function proxy(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    const { pathname, search } = req.nextUrl;
    return NextResponse.redirect(new URL(pathname + search, `https://${CANONICAL}`), 301);
  }
  return NextResponse.next();
}
export const config = { matcher: "/:path*" };
