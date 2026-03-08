"use client";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <RegisterForm
      onBack={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
