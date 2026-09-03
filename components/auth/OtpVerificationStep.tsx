"use client";

import { FormEvent } from "react";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";

interface OtpVerificationStepProps {
  email: string;
  code: string;
  error: string | null;
  isVerifying: boolean;
  isResending: boolean;
  resendIn: number;
  expiresIn: number;
  isExpired: boolean;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Second step of registration: the user proves they can read the mailbox they signed up with.
 *
 * Presentational only — every value arrives as a prop and every action is a callback, so this
 * component has no idea an HTTP API exists.
 */
export default function OtpVerificationStep({
  email,
  code,
  error,
  isVerifying,
  isResending,
  resendIn,
  expiresIn,
  isExpired,
  onCodeChange,
  onVerify,
  onResend,
  onBack,
}: OtpVerificationStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onVerify();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-seapedia-navy/10">
          <MailCheck className="h-6 w-6 text-seapedia-navy" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Email</h1>
        <p className="mt-2 text-sm text-gray-500">
          Kami mengirim kode 6 digit ke{" "}
          <span className="font-semibold text-gray-800">{email}</span>. Masukkan kode tersebut
          untuk mengaktifkan akun Anda.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <OtpInput
        value={code}
        onChange={onCodeChange}
        disabled={isVerifying}
        error={!!error}
        autoFocus
      />

      <p className="text-center text-xs text-gray-500">
        {isExpired ? (
          <span className="text-red-600">Kode sudah kedaluwarsa. Silakan kirim ulang.</span>
        ) : (
          <>Kode berlaku selama {formatSeconds(expiresIn)}</>
        )}
      </p>

      <Button
        type="submit"
        disabled={code.length !== 6 || isVerifying || isExpired}
        icon={!isVerifying ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : undefined}
      >
        {isVerifying ? "Memverifikasi..." : "Verifikasi & Aktifkan Akun"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        Tidak menerima kode?{" "}
        {resendIn > 0 ? (
          // The countdown mirrors the server cooldown, so the button only becomes clickable
          // when a resend would actually be accepted.
          <span className="font-medium text-gray-400">Kirim ulang dalam {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="cursor-pointer font-semibold text-seapedia-navy hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? "Mengirim..." : "Kirim ulang kode"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Ubah alamat email
      </button>
    </form>
  );
}
