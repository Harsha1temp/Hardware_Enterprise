import LoginForm from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Hardware Enterprise",
  description: "Login to your account to access your orders and cart",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h1>
        <LoginForm />
      </div>
    </div>
  )
}

