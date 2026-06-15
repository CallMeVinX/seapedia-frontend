"use client";

import { useState, FormEvent, ChangeEvent, FocusEvent } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import InputField from "@/components/ui/InputField";
import CheckboxField from "@/components/ui/CheckboxField";
import Button from "@/components/ui/Button";
import { validateField } from "@/utils/validation";

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
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

    if (type !== "checkbox" && (touched[name] || errors[name])) {
      const errorMsg = validateField(name, value, updatedForm);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fieldsToValidate = ["email", "password"];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fieldsToValidate.forEach((field) => {
      const val = form[field as keyof LoginFormState];
      newErrors[field] = validateField(field, typeof val === "boolean" ? "" : val);
      newTouched[field] = true;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => !!err);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: integrate with auth endpoint, e.g.:
      // await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col justify-center space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Log in to discover amazing deals and shop your favorite products.
        </p>
      </div>

      <InputField
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        autoComplete="email"
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        required
      />

      <InputField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
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

      <div className="flex items-center justify-between">
        <CheckboxField
          id="remember"
          name="remember"
          label="Remember Me"
          checked={form.remember}
          onChange={handleChange}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-seapedia-navy hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-seapedia-navy hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
