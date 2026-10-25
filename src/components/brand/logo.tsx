import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string | null;
  showWordmark?: boolean;
};

export function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  const inner = (
    <>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-[26px] w-[26px] shrink-0"
        fill="none"
      >
        <rect x="4" y="13" width="44" height="7" fill="currentColor" />
        <rect x="4" y="28.5" width="26" height="7" fill="currentColor" opacity="0.55" />
        <rect x="4" y="44" width="44" height="7" fill="currentColor" />
        <rect x="44" y="28.5" width="4" height="7" fill="currentColor" opacity="0.25" />
      </svg>
      {showWordmark ? (
        <span className="text-[0.92rem] font-semibold uppercase leading-none tracking-[0.2em]">
          Stacklab
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <span className={cn("inline-flex items-center gap-2.5 text-fg", className)}>{inner}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="STACKLAB - на главную"
      className={cn(
        "inline-flex items-center gap-2.5 text-fg transition-opacity duration-300 hover:opacity-70",
        className,
      )}
    >
      {inner}
    </Link>
  );
}
