// components/navbar.tsx (Corrected - Added missing return statement)
"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, ListOrdered, LayoutDashboard } from "lucide-react" // Added ListOrdered, LayoutDashboard
import { useAuth } from "@/lib/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { items } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ];

  const cartItemCount = items?.length || 0;

  // --- ADDED return ( ---
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
        <Image
    src="/logo2.png" // Path relative to the public folder
    alt="Om Sai Enterprises Logo" // Descriptive alt text
    width={75} // Adjust width as needed
    height={20} // Adjust height as needed
    priority // Add priority if it's above the fold for faster loading
  />
          <span className="text-xl font-bold text-orange-600">Om Sai Enterprises</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${
                pathname === link.href ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${
                pathname?.startsWith("/admin") ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Cart button */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Auth buttons */}
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                   <UserIcon className="h-5 w-5" />
                   <span className="sr-only">{user.name} Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hi, {user.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {user.role === 'admin' && (
                     <DropdownMenuItem asChild>
                         <Link href="/admin">
                             <LayoutDashboard className="mr-2 h-4 w-4" />
                             Admin Dashboard
                         </Link>
                      </DropdownMenuItem>
                 )}
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                     <ListOrdered className="mr-2 h-4 w-4" />
                     My Orders
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link href="/profile">
                     <UserIcon className="mr-2 h-4 w-4" />
                     Profile
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden space-x-2 md:flex">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === link.href ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname?.startsWith("/admin") ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Admin Panel
              </Link>
            )}
            {!user && !isLoading && (
              <div className="flex flex-col space-y-2 border-t pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  ); // --- Ensure closing parenthesis for return ---
}