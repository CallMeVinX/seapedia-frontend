"use client";

import { useState, FormEvent, ChangeEvent, FocusEvent } from "react";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import InputField from "@/components/ui/InputField";
import CheckboxField from "@/components/ui/CheckboxField";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { validateField } from "@/utils/validation";
import { authService } from "@/services/authService";
import { showToast } from "@/utils/toast";
import { TERMS_CONTENT, PRIVACY_CONTENT } from "./authContent";

interface RegisterFormState {
  [key: string]: string | boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [form, setForm] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value, form);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const updatedForm = {
      ...form,
      [name]: val,
    };
    setForm(updatedForm);

    if (type === "checkbox") {
      const errorMsg = validateField(name, checked ? "true" : "false", updatedForm);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    } else if (touched[name] || errors[name]) {
      const errorMsg = validateField(name, value, updatedForm);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }

    if (name === "password" && updatedForm.confirmPassword && (touched.confirmPassword || errors.confirmPassword)) {
      const confirmErrorMsg = validateField("confirmPassword", updatedForm.confirmPassword, updatedForm);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErrorMsg }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fieldsToValidate = ["firstName", "email", "phone", "password", "confirmPassword", "agree"];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fieldsToValidate.forEach((field) => {
      const val = form[field as keyof RegisterFormState];
      newErrors[field] = validateField(field, typeof val === "boolean" ? (val ? "true" : "false") : val, form);
      newTouched[field] = true;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => !!err);
    if (hasErrors) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      // We are omitting the phone field in this API request since backend doesn't support it yet
      await authService.register(fullName, form.email as string, form.password as string);
      
      showToast.success("Berhasil", "Registrasi akun berhasil!");
      router.push("/login");
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
        showToast.error("Gagal", err.response.data.detail);
      } else {
        setError("An unexpected error occurred during registration. Please try again.");
        showToast.error("Gagal", "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-1 text-sm text-gray-500">Join SEAPEDIA to start shopping and discover great deals.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InputField
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          value={form.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          required
        />
        <InputField
          id="lastName"
          name="lastName"
          label="Last Name (Optional)"
          placeholder="Doe"
          autoComplete="family-name"
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          value={form.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
        />
      </div>

      <InputField
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="john@example.com"
        autoComplete="email"
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        required
      />

      <InputField
        id="phone"
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="+62 812-3456-7890"
        autoComplete="tel"
        icon={<Phone className="h-4 w-4" aria-hidden="true" />}
        value={form.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        required
      />

      <InputField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon={<Lock className="h-4 w-4" aria-hidden="true" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }
        value={form.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        required
      />

      <InputField
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        label="Confirm Password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon={<Lock className="h-4 w-4" aria-hidden="true" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }
        value={form.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        required
      />

      <CheckboxField
        id="agree"
        name="agree"
        checked={form.agree}
        onChange={handleChange}
        error={errors.agree}
        required
        label={
          <>
            I agree to the{" "}
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="font-medium text-seapedia-navy hover:underline focus:outline-none cursor-pointer inline-block"
            >
              Terms &amp; Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="font-medium text-seapedia-navy hover:underline focus:outline-none cursor-pointer inline-block"
            >
              Privacy Policy
            </button>
            .
          </>
        }
      />

      <Button type="submit" disabled={isSubmitting} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-seapedia-navy hover:underline">
          Log in here
        </Link>
      </p>

      {/* Terms & Conditions Modal */}
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="Terms & Conditions">
        <div className="space-y-4">
          {TERMS_CONTENT.map((section, idx) => (
            <section key={idx}>
              <h4 className="font-semibold text-gray-900 mb-1">{section.title}</h4>
              <p>{section.paragraph}</p>
            </section>
          ))}
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
        <div className="space-y-4">
          {PRIVACY_CONTENT.map((section, idx) => (
            <section key={idx}>
              <h4 className="font-semibold text-gray-900 mb-1">{section.title}</h4>
              <p>{section.paragraph}</p>
            </section>
          ))}
        </div>
      </Modal>
    </form>
  );
}