"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // In a real app, this would call an API to authenticate
    // For demo purposes, we'll simulate a successful login

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials (demo only)
    if (email && password) {
      const newUser = {
        id: "123",
        name: email.split("@")[0],
        email,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would call an API to register a new user
    // For demo purposes, we'll simulate a successful registration

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if inputs are valid (demo only)
    if (name && email && password) {
      // Registration successful, but we don't log in automatically
      return
    } else {
      throw new Error("Invalid registration data")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}