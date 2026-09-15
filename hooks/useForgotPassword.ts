"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { authService } from "@/services/authService";

/**
 * Workflow stages for account password recovery:
 * 1. "email": User specifies their account address to trigger OTP challenge.
 * 2. "otp": User enters the 6-digit verification code sent to their mailbox.
 * 3. "new-password": User configures and confirms their replacement password (only after PIN verified).
 * 4. "success": Confirmation screen directing the user to sign in.
 */
export type ForgotPasswordStep = "email" | "otp" | "new-password" | "success";

interface StoredForgotPasswordSession {
  email: string;
  expiresAt: number;
  resendAvailableAt: number;
}

interface ApiErrorBody {
  detail?: string;
}

const SESSION_KEY = "seapedia_forgot_password_session";
const FALLBACK_ERROR = "Terjadi kesalahan. Silakan coba lagi.";
const MAX_STALE_SESSION_MS = 15 * 60 * 1000; // 15 minutes max TTL for local recovery session

/**
 * Safely extracts human-readable error messages from Axios response payloads.
 */
function readApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError?.response?.data?.detail || FALLBACK_ERROR;
}

/**
 * Extracts rate-limiting retry cooldown from the HTTP Retry-After response header.
 */
function readRetryAfter(error: unknown, fallbackSeconds: number): number {
  const axiosError = error as AxiosError;
  const header = axiosError?.response?.headers?.["retry-after"];
  const parsed = Number(header);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackSeconds;
}

/**
 * Persists non-sensitive recovery metadata (email & timestamp references) in sessionStorage.
 * Sensitive secrets (OTP code, password) are strictly maintained in React memory state.
 */
function saveSession(email: string, expiresAt: number, resendAvailableAt: number): void {
  if (typeof window === "undefined") return;
  try {
    const session: StoredForgotPasswordSession = {
      email,
      expiresAt,
      resendAvailableAt,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Gracefully ignore sessionStorage restrictions in private browsing modes
  }
}

/**
 * Purges the password recovery session state from browser storage.
 */
function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Gracefully ignore errors
  }
}

/**
 * Loads and validates active recovery session metadata upon client hydration.
 */
function loadSession(): {
  email: string;
  expiresAt: number;
  resendAvailableAt: number;
  expiresIn: number;
  resendIn: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredForgotPasswordSession;
    if (!session?.email || typeof session.expiresAt !== "number") {
      clearSession();
      return null;
    }

    const now = Date.now();
    if (now - session.expiresAt > MAX_STALE_SESSION_MS) {
      clearSession();
      return null;
    }

    const expiresIn = Math.max(0, Math.ceil((session.expiresAt - now) / 1000));
    const resendIn = Math.max(0, Math.ceil((session.resendAvailableAt - now) / 1000));

    return {
      email: session.email,
      expiresAt: session.expiresAt,
      resendAvailableAt: session.resendAvailableAt,
      expiresIn,
      resendIn,
    };
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Logical Agent (Controller Hook) for the Multi-Step Password Recovery Flow.
 *
 * Implements clean state management, multi-step orchestration (email -> OTP -> password -> success),
 * dual-layer input validation, and wall-clock synchronized cooldown tickers.
 */
export function useForgotPassword() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);

  const expiresAtRef = useRef<number>(0);
  const resendAvailableAtRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore pending password reset session from sessionStorage on client mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      expiresAtRef.current = session.expiresAt;
      resendAvailableAtRef.current = session.resendAvailableAt;
      setEmail(session.email);
      setExpiresIn(session.expiresIn);
      setResendIn(session.resendIn);
      // Restore to OTP step so user can continue verification
      setStep("otp");
    }
  }, []);

  // Synchronize wall-clock timers for countdowns across OTP and Password steps
  useEffect(() => {
    if (step !== "otp" && step !== "new-password") return;

    const tick = () => {
      const now = Date.now();
      setExpiresIn(Math.max(0, Math.ceil((expiresAtRef.current - now) / 1000)));
      setResendIn(Math.max(0, Math.ceil((resendAvailableAtRef.current - now) / 1000)));
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [step]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setError(null);
    setEmailError(null);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setError(null);
  }, []);

  const handleNewPasswordChange = useCallback((value: string) => {
    setNewPassword(value);
    setError(null);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setError(null);
  }, []);

  /**
   * Phase 1: Request recovery OTP challenge for target email address.
   */
  const handleRequestOtp = useCallback(async () => {
    if (!email.trim()) {
      setEmailError("Email wajib diisi.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Format email tidak valid.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setEmailError(null);

    try {
      const challenge = await authService.forgotPassword(email.trim());
      const now = Date.now();
      const expiresAt = now + challenge.expires_in_seconds * 1000;
      const resendAvailableAt = now + challenge.resend_available_in_seconds * 1000;

      expiresAtRef.current = expiresAt;
      resendAvailableAtRef.current = resendAvailableAt;

      setExpiresIn(challenge.expires_in_seconds);
      setResendIn(challenge.resend_available_in_seconds);
      setCode("");
      setResetToken(null);
      setNewPassword("");
      setConfirmPassword("");
      setStep("otp");

      saveSession(email.trim(), expiresAt, resendAvailableAt);
    } catch (err) {
      const errMsg = readApiError(err);
      setError(errMsg);
      if (errMsg.toLowerCase().includes("tidak terdaftar") || errMsg.toLowerCase().includes("tidak ditemukan")) {
        setEmailError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  /**
   * Phase 2: Progress from OTP entry to new password configuration.
   * Wajib memverifikasi kode PIN 6 digit ke backend terlebih dahulu.
   * Form ganti kata sandi baru HANYA akan muncul jika verifikasi backend berhasil.
   */
  const handleProceedToNewPassword = useCallback(async () => {
    if (code.length !== 6) {
      setError("Kode verifikasi 6 digit harus diisi lengkap.");
      return;
    }
    if (expiresIn === 0) {
      setError("Kode verifikasi sudah kedaluwarsa. Silakan kirim ulang kode.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Panggil endpoint /auth/reset-password/verify untuk memvalidasi PIN 6 digit
      const res = await authService.verifyResetCode(email, code);
      setResetToken(res.reset_token);

      // Sinkronkan batas waktu jika disediakan server
      if (res.expires_in_seconds) {
        const now = Date.now();
        const expiresAt = now + res.expires_in_seconds * 1000;
        expiresAtRef.current = expiresAt;
        setExpiresIn(res.expires_in_seconds);
      }

      // PIN valid -> baru buka form ganti password baru!
      setStep("new-password");
    } catch (err) {
      const errMsg = readApiError(err);
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, email, expiresIn]);

  /**
   * Phase 3: Validates replacement password and submits reset_token to backend API.
   */
  const handleResetPassword = useCallback(async () => {
    if (newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("Kata sandi baru harus mengandung kombinasi huruf dan angka.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (resetToken) {
        await authService.resetPassword(resetToken, newPassword);
      } else {
        await authService.resetPassword(email, code, newPassword);
      }
      clearSession();
      setResetToken(null);
      setStep("success");
    } catch (err) {
      const errMsg = readApiError(err);
      setError(errMsg);
      // Jika error terkait kode/token kadaluarsa, kembalikan ke layar OTP
      const lowerErr = errMsg.toLowerCase();
      if (
        lowerErr.includes("kode") ||
        lowerErr.includes("kedaluwarsa") ||
        lowerErr.includes("expired") ||
        lowerErr.includes("percobaan") ||
        lowerErr.includes("token")
      ) {
        setCode("");
        setResetToken(null);
        setStep("otp");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [resetToken, email, code, newPassword, confirmPassword]);

  /**
   * Re-dispatches a replacement OTP with backend cooldown enforcement.
   */
  const handleResendOtp = useCallback(async () => {
    if (resendIn > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      const challenge = await authService.resendResetPasswordOtp(email);
      const now = Date.now();
      const expiresAt = now + challenge.expires_in_seconds * 1000;
      const resendAvailableAt = now + challenge.resend_available_in_seconds * 1000;

      expiresAtRef.current = expiresAt;
      resendAvailableAtRef.current = resendAvailableAt;

      setExpiresIn(challenge.expires_in_seconds);
      setResendIn(challenge.resend_available_in_seconds);
      setCode("");
      setResetToken(null);

      saveSession(email, expiresAt, resendAvailableAt);
    } catch (err) {
      setError(readApiError(err));
      const retrySeconds = readRetryAfter(err, 60);
      const resendAvailableAt = Date.now() + retrySeconds * 1000;
      resendAvailableAtRef.current = resendAvailableAt;
      setResendIn(retrySeconds);
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendIn]);

  /**
   * Navigates back to the email input stage to modify email address.
   */
  const handleBackToEmail = useCallback(() => {
    clearSession();
    expiresAtRef.current = 0;
    resendAvailableAtRef.current = 0;
    setStep("email");
    setCode("");
    setResetToken(null);
    setError(null);
    setEmailError(null);
  }, []);

  /**
   * Navigates back from new password stage to the OTP verification stage.
   */
  const handleBackToOtp = useCallback(() => {
    setError(null);
    setResetToken(null);
    setStep("otp");
  }, []);

  return {
    step,
    email,
    code,
    resetToken,
    newPassword,
    confirmPassword,
    error,
    emailError,
    isSubmitting,
    isResending,
    resendIn,
    expiresIn,
    isExpired: (step === "otp" || step === "new-password") && expiresIn === 0,
    handleEmailChange,
    handleCodeChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleRequestOtp,
    handleProceedToNewPassword,
    handleResetPassword,
    handleResendOtp,
    handleBackToEmail,
    handleBackToOtp,
  };
}
