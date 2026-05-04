"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * INR currency input — Indian locale grouping (1,00,000), forwards refs,
 * works inline and with react-hook-form `Controller`.
 *
 * Stores raw number in form state, displays formatted ₹ string while not focused.
 */

export interface CurrencyInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  prefix?: string;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const formatINR = (n: number): string => {
  if (!Number.isFinite(n) || n === 0) return "";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
};

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { prefix = "₹", className, value, onChange, onBlur, onFocus, placeholder, ...rest },
    ref,
  ) {
    const [focused, setFocused] = React.useState(false);
    const numeric = typeof value === "number" ? value : 0;

    // While focused, show raw number string (no formatting). Otherwise show grouped.
    const display = focused
      ? numeric === 0
        ? ""
        : String(numeric)
      : formatINR(numeric);

    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {prefix}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={cn("pl-7 tabular-nums", className)}
          placeholder={placeholder ?? "0"}
          value={display}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            // Strip everything except digits and a single dot
            const raw = e.target.value.replace(/[^\d.]/g, "");
            const num = raw === "" ? 0 : Number(raw);
            if (Number.isFinite(num)) onChange?.(num);
          }}
          {...rest}
        />
      </div>
    );
  },
);
