import { SOCIAL } from "@/lib/videos";
export function Social() {
  return (
    <div className="social">
      <a href={SOCIAL.tiktok} target="_blank" rel="noopener me">TikTok @hiddenclean.tips</a>
      <a href={SOCIAL.instagram} target="_blank" rel="noopener me">Instagram @hiddenclean.hacks</a>
    </div>
  );
}
