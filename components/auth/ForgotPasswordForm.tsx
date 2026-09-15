"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";
import { useForgotPassword } from "@/hooks/useForgotPassword";

/**
 * Formats a total duration in seconds into MM:SS format.
 */
function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Presentational Agent (Atomic UI Component) for Password Recovery.
 *
 * Implements a clean 4-step wizard interface:
 * 1. Email Submission
 * 2. 6-Digit Numeric OTP Verification
 * 3. Replacement Password Configuration
 * 4. Recovery Confirmation
 *
 * Strictly decoupled from API calls, delegating all state transitions
 * and validations to the useForgotPassword logical agent.
 */
export default function ForgotPasswordForm() {
  const fp = useForgotPassword();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fp.handleRequestOtp();
  }

  function handleOtpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fp.handleProceedToNewPassword();
  }

  function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fp.handleResetPassword();
  }

  // =========================================================================
  // Step 4: Success View
  // =========================================================================
  if (fp.step === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Kata Sandi Berhasil Diperbarui</h1>
          <p className="text-sm text-gray-600">
            Kata sandi untuk akun <span className="font-semibold text-gray-800">{fp.email}</span> telah
            berhasil diubah. Silakan masuk menggunakan kata sandi baru Anda.
          </p>
        </div>
        <Link href="/login" className="block w-full">
          <Button variant="primary" className="w-full">
            Masuk ke Akun Anda
          </Button>
        </Link>
      </div>
    );
  }

  // =========================================================================
  // Step 3: Replacement Password Entry
  // =========================================================================
  if (fp.step === "new-password") {
    const isMinLength = fp.newPassword.length >= 8;
    const hasLettersAndDigits = /[a-zA-Z]/.test(fp.newPassword) && /\d/.test(fp.newPassword);
    const isMatching = fp.newPassword.length > 0 && fp.newPassword === fp.confirmPassword;
    const isValidForm = isMinLength && hasLettersAndDigits && isMatching;

    return (
      <form onSubmit={handlePasswordSubmit} noValidate className="space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-seapedia-navy/10 text-seapedia-navy">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Kata Sandi Baru</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tentukan kata sandi baru untuk akun{" "}
            <span className="font-semibold text-gray-800">{fp.email}</span>.
          </p>
        </div>

        {fp.error && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {fp.error}
          </div>
        )}

        <div className="relative">
          <InputField
            id="newPassword"
            name="newPassword"
            label="Kata Sandi Baru"
            type={showNewPassword ? "text" : "password"}
            value={fp.newPassword}
            onChange={(e) => fp.handleNewPasswordChange(e.target.value)}
            placeholder="Minimal 8 karakter alfanumerik"
            icon={<Lock className="h-5 w-5" />}
            autoFocus
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <InputField
            id="confirmPassword"
            name="confirmPassword"
            label="Konfirmasi Kata Sandi Baru"
            type={showConfirmPassword ? "text" : "password"}
            value={fp.confirmPassword}
            onChange={(e) => fp.handleConfirmPasswordChange(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            icon={<Lock className="h-5 w-5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Kriteria kata sandi:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li className={isMinLength ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Minimal 8 karakter
            </li>
            <li className={hasLettersAndDigits ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Mengandung kombinasi huruf dan angka
            </li>
            <li className={isMatching ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Konfirmasi kata sandi cocok
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={!isValidForm || fp.isSubmitting || fp.isExpired}
          icon={!fp.isSubmitting ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : undefined}
          className="w-full"
        >
          {fp.isSubmitting ? "Menyimpan kata sandi..." : "Simpan Kata Sandi Baru"}
        </Button>

        <button
          type="button"
          onClick={fp.handleBackToOtp}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke verifikasi kode OTP
        </button>
      </form>
    );
  }

  // =========================================================================
  // Step 2: 6-Digit OTP Verification View
  // =========================================================================
  if (fp.step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} noValidate className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-seapedia-navy/10 text-seapedia-navy">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi Kode OTP</h1>
          <p className="mt-1 text-sm text-gray-500">
            Masukkan kode 6 digit yang dikirim ke{" "}
            <span className="font-semibold text-gray-800">{fp.email}</span>.
          </p>
        </div>

        {fp.error && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {fp.error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
            Kode Verifikasi 6 Digit
          </label>
          <OtpInput
            value={fp.code}
            onChange={fp.handleCodeChange}
            disabled={fp.isSubmitting}
            error={!!fp.error}
            autoFocus
          />
          <p className="text-center text-xs text-gray-500">
            {fp.isExpired ? (
              <span className="text-red-600">Kode sudah kedaluwarsa. Silakan kirim ulang.</span>
            ) : (
              <>Kode berlaku selama {formatSeconds(fp.expiresIn)}</>
            )}
          </p>
        </div>

        <Button
          type="submit"
          disabled={fp.code.length !== 6 || fp.isExpired || fp.isSubmitting}
          icon={!fp.isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : undefined}
          className="w-full"
        >
          {fp.isSubmitting ? "Memverifikasi kode PIN..." : "Lanjutkan ke Kata Sandi Baru"}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Tidak menerima kode?{" "}
          {fp.resendIn > 0 ? (
            <span className="font-medium text-gray-400">Kirim ulang dalam {fp.resendIn}s</span>
          ) : (
            <button
              type="button"
              onClick={fp.handleResendOtp}
              disabled={fp.isResending}
              className="cursor-pointer font-semibold text-seapedia-navy hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {fp.isResending ? "Mengirim..." : "Kirim ulang kode"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={fp.handleBackToEmail}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Ubah alamat email
        </button>
      </form>
    );
  }

  // =========================================================================
  // Step 1: Target Email Input View
  // =========================================================================
  return (
    <form onSubmit={handleEmailSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Lupa Kata Sandi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Masukkan alamat email akun Anda. Kami akan mengirimkan kode verifikasi 6 digit untuk mengatur ulang kata sandi.
        </p>
      </div>

      {fp.error && (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          <p>{fp.error}</p>
          {fp.error.toLowerCase().includes("tidak terdaftar") && (
            <p className="mt-1 text-xs">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-semibold underline hover:text-red-900">
                Daftar di sini
              </Link>
            </p>
          )}
        </div>
      )}

      <InputField
        id="email"
        name="email"
        label="Alamat Email"
        type="email"
        value={fp.email}
        onChange={(e) => fp.handleEmailChange(e.target.value)}
        placeholder="nama@email.com"
        error={fp.emailError || undefined}
        icon={<Mail className="h-5 w-5" />}
        autoFocus
        autoComplete="email"
        required
      />

      <Button type="submit" disabled={fp.isSubmitting} className="w-full">
        {fp.isSubmitting ? "Memeriksa email..." : "Kirim Kode Verifikasi"}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Halaman Masuk
        </Link>
      </div>
    </form>
  );
}
