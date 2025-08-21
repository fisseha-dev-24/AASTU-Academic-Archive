import React, { forwardRef } from "react";

type Variant = "default" | "primary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

type Props = {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string; // when provided, renders an anchor styled like a button
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  "aria-label"?: string;
  title?: string;
};

/**
 * Common Button
 *
 * - Supports variants and sizes via class names (btn, btn--primary, btn--sm, etc.)
 * - Accessible: when loading sets aria-busy, disables interactions, and uses aria-live via parent when needed
 * - Renders <button> by default, or <a> when href is provided
 * - ForwardRef-compatible
 *
 * Styling expectation:
 * Use your global CSS to style classes: btn, btn--primary, btn--ghost, btn--danger, btn--success,
 * btn--sm, btn--md, btn--lg, btn--loading. Minimal inline styles applied for disabled state.
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>((props, ref) => {
  const {
    children,
    variant = "default",
    size = "md",
    className = "",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    href,
    type = "button",
    onClick,
    title,
    ...rest
  } = props;

  const isDisabled = disabled || loading;
  const baseClass = "btn";
  const classes = [
    baseClass,
    variant && `${baseClass}--${variant}`,
    size && `${baseClass}--${size}`,
    loading ? `${baseClass}--loading` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const commonProps = {
    className: classes,
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    title,
    onClick: isDisabled ? undefined : onClick,
  } as React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>;

  const spinner = (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 50 50"
      style={{ marginRight: 8 }}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        d="M25 5a20 20 0 1 0 20 20"
        opacity="0.25"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        d="M45 25a20 20 0 0 0-20-20"
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );

  // Render anchor when href provided (styled like a button)
  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={isDisabled ? undefined : href}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...rest}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) onClick(e as any);
        }}
        style={{
          pointerEvents: isDisabled ? "none" : undefined,
          opacity: isDisabled ? 0.6 : undefined,
          textDecoration: "none",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {loading ? spinner : leftIcon}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{children}</span>
          {rightIcon}
        </span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={isDisabled}
      {...(commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...rest}
      style={{
        cursor: isDisabled ? "not-allowed" : undefined,
        opacity: isDisabled ? 0.6 : undefined,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {loading ? spinner : leftIcon}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{children}</span>
        {rightIcon}
      </span>
    </button>
  );
});

Button.displayName = "Button";

export default Button;
