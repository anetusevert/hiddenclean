import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTip, SITE_NAME } from "@/lib/tips";
import { shortFor } from "@/lib/videos";

// Per-tip 1200x630 share card (og:image, twitter:image, HowTo.image). Live tips only: future tips 404 like their pages.
export const revalidate = 86400;
const font = (w: number) => readFile(join(process.cwd(), "public", "fonts", `PlusJakartaSans-${w}.woff`));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const tip = getTip((await params).slug);
  if (!tip) return new Response("Not found", { status: 404 });
  const v = shortFor(tip.slug);
  let thumb: string | null = null;
  if (v) {
    try { thumb = `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", "v", `${v.id}.jpg`))).toString("base64")}`; } catch { thumb = null; }
  }
  const hook = tip.displayName.length > 70 ? tip.displayName.slice(0, 67) + "…" : tip.displayName;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg, #14325f, #1d4a85)", color: "#fff", fontFamily: "Jakarta" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800 }}>
            <span>Hidden</span><span style={{ color: "#4dbb9f" }}>Clean</span>
            <span style={{ marginLeft: 18, fontSize: 20, fontWeight: 700, color: "#14325f", background: "#4dbb9f", padding: "6px 14px", borderRadius: 999 }}>{tip.hubs[0].label.toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: hook.length > 45 ? 58 : 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1 }}>{hook}</div>
            <div style={{ marginTop: 22, fontSize: 28, color: "#d6e2f3" }}>{tip.title}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#4dbb9f", fontWeight: 700 }}>{`${tip.steps.length} steps · safety-checked · www.hiddenclean.com`}</div>
        </div>
        {thumb && (
          <div style={{ width: 360, height: "100%", display: "flex", padding: "36px 40px 36px 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} width={320} height={558} style={{ borderRadius: 24, objectFit: "cover", border: "4px solid #4dbb9f" }} alt="" />
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Jakarta", data: await font(400), weight: 400, style: "normal" }, { name: "Jakarta", data: await font(800), weight: 800, style: "normal" }], headers: { "cache-control": "public, max-age=86400, s-maxage=86400" } },
  );
}
