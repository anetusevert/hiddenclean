import { NextResponse, type NextRequest } from "next/server";

// 301 non-canonical hosts (apex, Railway host) to www.
const CANONICAL = "www.hiddenclean.com";
const REDIRECT_HOSTS = new Set<string>(["hiddenclean.com", "web-production-e492f.up.railway.app"]);

export function proxy(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    const { pathname, search } = req.nextUrl;
    return NextResponse.redirect(new URL(pathname + search, `https://${CANONICAL}`), 301);
  }
  return NextResponse.next();
}
export const config = { matcher: "/:path*" };
