export function validateFirstName(firstName: string): string {
  return firstName.trim() ? "" : "First name is required.";
}

export function validateEmail(email: string): string {
  if (!email.trim()) return "Email is required.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
  return "";
}

export function validatePhone(phone: string): string {
  if (!phone.trim()) return "Phone number is required.";
  if (!phone.startsWith("+")) return "Phone number must start with '+'.";
  const digitsOnly = phone.slice(1).replace(/[\s\-]/g, "");
  if (!digitsOnly || !/^\d+$/.test(digitsOnly)) {
    return "Phone number must contain only numbers after the '+' prefix.";
  }
  return "";
}

export function validatePassword(password: string): string {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  // Mirrors the backend rule. Without it the form accepts a password the API then rejects
  // with a 422 that the user has no way to act on.
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain both letters and numbers.";
  }
  return "";
}

export function validateConfirmPassword(confirmPassword: string, passwordFieldVal: string): string {
  if (!confirmPassword) return "Please confirm your password.";
  if (confirmPassword !== passwordFieldVal) return "Passwords do not match.";
  return "";
}

export function validateAgree(agree: boolean | string): string {
  const isAgree = typeof agree === "string" ? agree === "true" : agree;
  return isAgree ? "" : "You must agree to the Terms & Conditions and Privacy Policy.";
}

/**
 * Presence check for the login password field.
 *
 * Login must never re-apply the registration complexity rules. Those rules govern the
 * creation of a new secret; at login the user is entering an existing one, and the backend is
 * the sole authority on whether it is correct. Enforcing complexity here would lock out every
 * account whose password predates the current policy.
 */
export function validateLoginPassword(password: string): string {
  return password ? "" : "Password is required.";
}

/**
 * Field validator for the registration form, where password complexity is enforced.
 * Pass the full form object as context for confirmPassword matching.
 */
export function validateField(name: string, value: string, context?: Record<string, string | boolean>): string {
  switch (name) {
    case "firstName":
      return validateFirstName(value);
    case "email":
      return validateEmail(value);
    case "phone":
      return validatePhone(value);
    case "password":
      return validatePassword(value);
    case "confirmPassword":
      return validateConfirmPassword(value, typeof context?.password === "string" ? context.password : "");
    case "agree":
      return validateAgree(value);
    default:
      return "";
  }
}

/**
 * Field validator for the login form.
 *
 * Delegates to the shared validators for everything except the password, which is only checked
 * for presence — see validateLoginPassword for why complexity is not re-enforced at login.
 */
export function validateLoginField(name: string, value: string): string {
  if (name === "password") {
    return validateLoginPassword(value);
  }
  return validateField(name, value);
}
