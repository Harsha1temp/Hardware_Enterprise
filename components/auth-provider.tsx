// "use client"

// import { createContext, useState, useEffect, type ReactNode } from "react"
// import { useRouter } from "next/navigation"

// type User = {
//   _id: string
//   name: string
//   email: string
//   isAdmin: boolean
// }

// type AuthContextType = {
//   user: User | null
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   register: (userData: any) => Promise<void>
//   isLoading: boolean
//   error: string | null
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   // Check if user is logged in on initial load
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await fetch("/api/auth/me")
//         if (response.ok) {
//           const data = await response.json()
//           setUser(data.user)
//         }
//       } catch (error) {
//         console.error("Auth check error:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     checkAuthStatus()
//   }, [])

//   // Login function
//   const login = async (email: string, password: string) => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed")
//       }

//       setUser(data.user)
//       router.push("/")
//       return Promise.resolve()
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Login failed")
//       return Promise.reject(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Register function
//   const register = async (userData: any) => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed")
//       }

//       setUser(data.user)
//       router.push("/")
//       return Promise.resolve()
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Registration failed")
//       return Promise.reject(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Logout function
//   const logout = async () => {
//     setIsLoading(true)

//     try {
//       await fetch("/api/auth/logout", {
//         method: "POST",
//       })
//       setUser(null)
//       router.push("/")
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>{children}</AuthContext.Provider>
//   )
// }
// components/auth-provider.tsx (Final - Review/Adjust as needed)
"use client"

import { createContext, useState, useEffect, type ReactNode, useContext } from "react" // Added useContext
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"; // Assuming you use Shadcn toaster

// Keep User type definition
type User = {
  _id: string
  name: string
  email: string
  isAdmin: boolean // Make sure API returns this or derive it from 'role'
  role?: 'user' | 'admin' // Add role if returned by API
}

type AuthContextType = {
  user: User | null
  login: (identifier: string, password: string) => Promise<void> // Use identifier
  logout: () => Promise<void> // Make async if needed
  register: (userData: any) => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void // Added function to clear errors
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Back to true initially
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast(); // Initialize toast

  // Check if user is logged in on initial load (Uncommented)
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
           if (data.user) { // Check if user data exists
             setUser(data.user)
           } else {
             setUser(null); // Ensure user is null if API doesn't return user
           }
        } else {
           setUser(null); // Set user to null on non-OK responses too
        }
      } catch (error) {
        console.error("Auth check error:", error)
         setUser(null); // Set user to null on fetch errors
      } finally {
        setIsLoading(false) // Stop loading
      }
    }

    checkAuthStatus() // Call the check function
  }, [])

  const clearError = () => setError(null);

  // Login function
  const login = async (identifier: string, password: string) => { // Changed email to identifier
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ identifier, password }), // Pass identifier
      })
      const data = await response.json()
      if (!response.ok) { throw new Error(data.message || "Login failed"); }

      setUser(data.user)
      toast({ title: "Login Successful", description: `Welcome back, ${data.user?.name}!` });
      router.push("/") // Navigate on success
      router.refresh(); // Force refresh to potentially update server components/layout
      return Promise.resolve()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setError(errorMessage)
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: any) => {
     setIsLoading(true)
     setError(null)
     try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify(userData),
        })
        const data = await response.json()
        if (!response.ok) { throw new Error(data.message || "Registration failed"); }

        // Optionally log in the user directly after registration
        setUser(data.user)
        // You might need to manually set the auth cookie here if the register API doesn't do it
        // Or fetch('/api/auth/login') after successful registration
        // Or just redirect to login page:
        toast({ title: "Registration Successful", description: "Please log in." });
        router.push("/login")
        // router.push("/") // Or redirect home if auto-logged in
        return Promise.resolve()
     } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Registration failed";
        setError(errorMessage)
        toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
        return Promise.reject(error)
     } finally {
        setIsLoading(false)
     }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", })
      if (!res.ok) { console.warn("Logout API call failed, but proceeding with client logout."); }

      setUser(null)
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // Redirecting might be better handled where logout is called, or use window.location for full reload
      // router.push("/login");
      window.location.href = '/login'; // Force full page reload after logout
    } catch (error) {
      console.error("Logout error:", error)
       toast({ title: "Logout Failed", description: "An error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error, clearError }}>{children}</AuthContext.Provider>
  )
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};