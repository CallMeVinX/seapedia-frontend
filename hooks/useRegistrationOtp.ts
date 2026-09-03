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
 * Owns the OTP phase of registration: which step is showing, the code being typed, the resend
 * countdown, and the calls to the auth service.
 *
 * State lives here rather than in the form so the presentational components stay free of API
 * knowledge, per the Logical Agent boundary. The caller supplies the email and timings it got
 * back from the register call; this hook never assumes an account exists, because the backend
 * answers identically for addresses that are already taken.
 */
export function useRegistrationOtp(onVerified?: (email: string) => void) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // A single ticker drives both counters. Clearing it on unmount matters because the user
    // can navigate away mid-countdown, and a stray interval would keep setting state on a
    // component that no longer exists.
    if (step !== "otp") return;

    intervalRef.current = setInterval(() => {
      setResendIn((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [step]);

  /** Moves the flow to the code screen once a registration has been staged server-side. */
  const beginChallenge = useCallback((targetEmail: string, timings: ChallengeTimings) => {
    setEmail(targetEmail);
    setCode("");
    setError(null);
    setExpiresIn(timings.expiresInSeconds);
    setResendIn(timings.resendAvailableInSeconds);
    setStep("otp");
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
      setExpiresIn(result.expires_in_seconds);
      setResendIn(result.resend_available_in_seconds);
      setCode("");
    } catch (err) {
      setError(readApiError(err));
      setResendIn(readRetryAfter(err, 60));
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendIn]);

  /** Returns to the details form, e.g. when the user notices a typo in their address. */
  const handleBackToForm = useCallback(() => {
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
