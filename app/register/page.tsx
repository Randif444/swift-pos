"use client";

import RegisterForm from "./RegisterForm";

// --- FRONTEND LAYER ---
// Core Page Container & Main Registration Form Injection
export default function RegisterPage() {
  return (
    <RegisterForm
      onBack={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}