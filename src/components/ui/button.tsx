import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "subtle";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-3 whitespace-nowrap font-medium transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-fg text-base hover:bg-white",
  outline: "border border-line bg-transparent text-fg hover:border-fg/60 hover:bg-white/[0.04]",
  ghost: "bg-transparent text-fg hover:bg-white/[0.06]",
  subtle: "bg-card text-fg border border-line hover:border-white/25",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.8125rem]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-7 text-[0.95rem]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      <span>{children}</span>
      {icon ? <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">{icon}</span> : null}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  external?: boolean;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  external = false,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
