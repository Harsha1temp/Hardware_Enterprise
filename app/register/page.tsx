// app/register/page.tsx
import type { Metadata } from "next";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register | Hardware Enterprise",
  description: "Create a new account to start shopping",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}