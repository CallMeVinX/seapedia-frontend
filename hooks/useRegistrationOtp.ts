"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { authService } from "@/services/authService";

type ChallengeTimings = {
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
};

interface ApiErrorBody {
  detail?: string;
}

const FALLBACK_ERROR = "Terjadi kesalahan. Silakan coba lagi.";

/**
 * Pulls the server's message out of an Axios failure.
 * The backend deliberately returns identical text for wrong, expired and unknown codes, so
 * whatever comes back is already safe to show without the UI adding its own interpretation.
 */
function readApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError?.response?.data?.detail || FALLBACK_ERROR;
}

/**
 * Reads the Retry-After header so a throttled response can drive the countdown.
 * Without it the button would re-enable on the client's own schedule and the user would be
 * rejected again, which reads as a broken button rather than a rate limit.
 */
function readRetryAfter(error: unknown, fallbackSeconds: number): number {
  const axiosError = error as AxiosError;
  const header = axiosError?.response?.headers?.["retry-after"];
  const parsed = Number(header);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackSeconds;
}

/**
 * Manages the OTP verification phase of registration: UI step transition,
 * numeric code state, resend cooldown timer, and API communication.
 *
 * State lives in this logical agent rather than the presentation form to keep
 * presentation components decoupled from service logic.
 *
 * Sessional state is persisted in sessionStorage and synchronized against
 * wall-clock timestamps to survive page refreshes without resetting expiry timers.
 */

interface StoredOtpSession {
  email: string;
  expiresAt: number; // Unix timestamp in ms
  resendAvailableAt: number; // Unix timestamp in ms
}

const OTP_SESSION_KEY = "seapedia_registration_otp_session";
const MAX_STALE_SESSION_MS = 15 * 60 * 1000; // 15 minutes post-expiry grace period

function saveOtpSession(email: string, expiresAt: number, resendAvailableAt: number): void {
  if (typeof window === "undefined") return;
  try {
    const session: StoredOtpSession = {
      email,
      expiresAt,
      resendAvailableAt,
    };
    sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage may be unavailable or restricted (e.g. private mode)
  }
}

function updateResendInSession(resendAvailableAt: number): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw) as StoredOtpSession;
    session.resendAvailableAt = resendAvailableAt;
    sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore errors
  }
}

function clearOtpSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(OTP_SESSION_KEY);
  } catch {
    // Ignore errors
  }
}

function loadOtpSession(): {
  email: string;
  expiresAt: number;
  resendAvailableAt: number;
  expiresIn: number;
  resendIn: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredOtpSession;
    if (!session?.email || typeof session.expiresAt !== "number") {
      clearOtpSession();
      return null;
    }

    const now = Date.now();
    if (now - session.expiresAt > MAX_STALE_SESSION_MS) {
      clearOtpSession();
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
    clearOtpSession();
    return null;
  }
}

export function useRegistrationOtp(onVerified?: (email: string) => void) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);

  const expiresAtRef = useRef<number>(0);
  const resendAvailableAtRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore pending OTP session from sessionStorage on client mount
  useEffect(() => {
    const session = loadOtpSession();
    if (session) {
      expiresAtRef.current = session.expiresAt;
      resendAvailableAtRef.current = session.resendAvailableAt;
      setEmail(session.email);
      setExpiresIn(session.expiresIn);
      setResendIn(session.resendIn);
      setStep("otp");
    }
  }, []);

  useEffect(() => {
    if (step !== "otp") return;

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

  /** Moves the flow to the code screen once a registration has been staged server-side. */
  const beginChallenge = useCallback((targetEmail: string, timings: ChallengeTimings) => {
    const now = Date.now();
    const expiresAt = now + timings.expiresInSeconds * 1000;
    const resendAvailableAt = now + timings.resendAvailableInSeconds * 1000;

    expiresAtRef.current = expiresAt;
    resendAvailableAtRef.current = resendAvailableAt;

    setEmail(targetEmail);
    setCode("");
    setError(null);
    setExpiresIn(timings.expiresInSeconds);
    setResendIn(timings.resendAvailableInSeconds);
    setStep("otp");

    saveOtpSession(targetEmail, expiresAt, resendAvailableAt);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setError(null);
  }, []);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6 || isVerifying) return;

    setIsVerifying(true);
    setError(null);
    try {
      await authService.verifyRegistration(email, code);
      clearOtpSession();
      onVerified?.(email);
    } catch (err) {
      setError(readApiError(err));
      // The code is cleared so the next attempt starts from an empty field; a stale wrong
      // code left in place invites the user to resubmit it and burn another attempt.
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  }, [code, email, isVerifying, onVerified]);

  const handleResend = useCallback(async () => {
    if (resendIn > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    try {
      const result = await authService.resendRegistrationOtp(email);
      const now = Date.now();
      const expiresAt = now + result.expires_in_seconds * 1000;
      const resendAvailableAt = now + result.resend_available_in_seconds * 1000;

      expiresAtRef.current = expiresAt;
      resendAvailableAtRef.current = resendAvailableAt;

      setExpiresIn(result.expires_in_seconds);
      setResendIn(result.resend_available_in_seconds);
      setCode("");

      saveOtpSession(email, expiresAt, resendAvailableAt);
    } catch (err) {
      setError(readApiError(err));
      const retrySeconds = readRetryAfter(err, 60);
      const resendAvailableAt = Date.now() + retrySeconds * 1000;
      resendAvailableAtRef.current = resendAvailableAt;
      setResendIn(retrySeconds);
      updateResendInSession(resendAvailableAt);
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendIn]);

  /** Returns to the details form, e.g. when the user notices a typo in their address. */
  const handleBackToForm = useCallback(() => {
    clearOtpSession();
    expiresAtRef.current = 0;
    resendAvailableAtRef.current = 0;
    setStep("form");
    setCode("");
    setError(null);
  }, []);

  return {
    step,
    email,
    code,
    error,
    isVerifying,
    isResending,
    resendIn,
    expiresIn,
    isExpired: step === "otp" && expiresIn === 0,
    beginChallenge,
    handleCodeChange,
    handleVerify,
    handleResend,
    handleBackToForm,
  };
}
