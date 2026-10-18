import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** The site mark. Same drawing as src/app/icon.svg. */
export function Logo(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
      <g fill="var(--color-on-accent)">
        <rect x="9" y="7" width="14" height="10" rx="3" />
        <rect x="5" y="13" width="5.5" height="10" rx="2.5" />
        <rect x="21.5" y="13" width="5.5" height="10" rx="2.5" />
        <rect x="9" y="18.5" width="14" height="4.5" rx="1" />
        <rect x="7" y="22" width="2.5" height="4" rx="1" />
        <rect x="22.5" y="22" width="2.5" height="4" rx="1" />
      </g>
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.5} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Cross(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.5} {...props}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}
