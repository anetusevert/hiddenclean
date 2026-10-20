import Link from "next/link";
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="27" cy="35" r="20" fill="none" stroke="#14325f" strokeWidth="6" />
      <circle cx="27" cy="35" r="13" fill="#9fd9c8" />
      <path d="M19 30a10 10 0 0 0 14 14" fill="none" stroke="#4dbb9f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M38 51l6 4" stroke="#14325f" strokeWidth="6" strokeLinecap="round" />
      <path d="M52 4l2.2 6.8L61 13l-6.8 2.2L52 22l-2.2-6.8L43 13l6.8-2.2z" fill="#4dbb9f" />
      <path d="M58 23l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#4dbb9f" />
    </svg>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="HiddenClean home">
          <Mark /> <span><b>Hidden</b><em>Clean</em></span>
        </Link>
        <nav aria-label="Main">
          <Link href="/tips">Tips</Link>
          <Link href="/how-to">By appliance</Link>
          <Link href="/subscribe" className="pill">Daily email</Link>
        </nav>
      </div>
    </header>
  );
}
