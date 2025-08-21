import React, { forwardRef, useId, useState } from "react";

type BaseProps =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
  as?: "input" | "textarea";
  rows?: number;
  showPasswordToggle?: boolean; // show a small "Show/Hide" control for password fields
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  type?: string;
} & BaseProps;

/**
 * Common Input component
 *
 * - Supports <input> and <textarea> (via `as` prop).
 * - Accessible: ties label, hint and error with aria attributes.
 * - ForwardRef compatible.
 * - Optional prefix/suffix slots and a password show/hide toggle.
 * - Minimal DOM structure and classes so you can style via your global CSS.
 *
 * Usage:
 * <Input id="email" label="Email" type="email" value={v} onChange={...} />
 * <Input as="textarea" label="Notes" rows={6} />
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>((props, ref) => {
  const {
    label,
    hint,
    error,
    id,
    as = "input",
    rows = 4,
    showPasswordToggle = false,
    prefix,
    suffix,
    className = "",
    type = "text",
    ...rest
  } = props;

  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = (type === "password" || (rest as any).type === "password");
  const effectiveType = isPassword && passwordVisible ? "text" : (type as string);

  const inputClasses = [
    "input",
    error ? "input--error" : "",
    prefix || suffix ? "input--with-adornments" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 700 }}>
          {label}
        </label>
      )}

      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        {prefix && (
          <div
            aria-hidden
            className="input-prefix"
            style={{ display: "flex", alignItems: "center", padding: "0 8px", fontSize: 13 }}
          >
            {prefix}
          </div>
        )}

        {as === "textarea" ? (
          <textarea
            id={inputId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            style={{ minHeight: rows * 24, resize: "vertical" }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <input
              id={inputId}
              ref={ref as React.Ref<HTMLInputElement>}
              type={effectiveType}
              className={inputClasses}
              aria-invalid={!!error}
              aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              style={{ flex: 1 }}
            />

            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setPasswordVisible((s) => !s)}
                aria-pressed={passwordVisible}
                className="btn"
                style={{ padding: "6px 8px", marginLeft: 4 }}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            )}

            {suffix && (
              <div aria-hidden className="input-suffix" style={{ display: "flex", alignItems: "center", padding: "0 8px", fontSize: 13 }}>
                {suffix}
              </div>
            )}
          </div>
        )}
      </div>

      {hint && (
        <div id={hintId} className="input-hint" style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {hint}
        </div>
      )}

      {error && (
        <div id={errorId} role="alert" className="input-error" style={{ fontSize: 13, color: "var(--danger)" }}>
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
