"use client";

import { ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

/**
 * Segmented numeric code entry.
 *
 * Purely presentational: it holds no verification logic and reports every change upward, so
 * the redemption call stays in the hook that owns it.
 *
 * Positions are tracked as a fixed-length array rather than by indexing into the value string.
 * A string cannot express "box 4 filled while box 2 is empty" — joining such a state silently
 * shifts digits left, so a digit typed into a later box would appear somewhere else entirely.
 * The array keeps each digit where the user put it; the joined string handed to the parent is
 * shorter than the full length while gaps remain, which correctly reads as "not complete yet".
 */
export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => value[i] ?? "")
  );

  // Mirrors the committed digits synchronously. Reading state directly loses characters when
  // keystrokes arrive faster than React re-renders, because focus moves to the next box
  // immediately — pasted codes and one-time-code autofill both deliver input that fast.
  const digitsRef = useRef(digits);

  useEffect(() => {
    // Re-sync only when the parent replaces the value, such as clearing the field after a
    // rejected code or a resend. Comparing against the joined form avoids fighting the local
    // state on every keystroke we ourselves just reported.
    if (value !== digitsRef.current.join("")) {
      const next = Array.from({ length }, (_, i) => value[i] ?? "");
      digitsRef.current = next;
      setDigits(next);
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  function commit(next: string[]) {
    digitsRef.current = next;
    setDigits(next);
    onChange(next.join(""));
  }

  function focusAt(index: number) {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  }

  function handleInput(index: number, raw: string) {
    // Only the last typed character is kept: typing into an already-filled box should replace
    // it rather than append, which is what a user expects when correcting a single digit.
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;

    const next = digitsRef.current.slice();
    next[index] = digit;
    commit(next);

    if (index < length - 1) focusAt(index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = digitsRef.current.slice();

      if (next[index]) {
        next[index] = "";
        commit(next);
        return;
      }
      // Already empty, so backspace clears the previous box and moves there. Without this the
      // caret gets stuck on an empty field and the code cannot be erased backwards.
      if (index > 0) {
        next[index - 1] = "";
        commit(next);
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    // Codes arrive by email and are almost always pasted whole, so the paste must fill every
    // box at once instead of dropping six characters into one.
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    commit(Array.from({ length }, (_, i) => pasted[i] ?? ""));
    focusAt(Math.min(pasted.length, length - 1));
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Kode verifikasi">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ke-${index + 1}`}
          aria-invalid={error}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-12 w-11 sm:h-14 sm:w-12 rounded-md border bg-white text-center text-xl font-semibold text-gray-900",
            "transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-seapedia-navy focus:ring-seapedia-navy"
          )}
        />
      ))}
    </div>
  );
}
