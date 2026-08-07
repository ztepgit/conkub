// components/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Music2, User as UserIcon, Loader2, LogOut, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { GoogleLoginCard } from "@/components/google-login-card";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/concerts", label: "Concerts" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

// 🔴 เลิกใช้ interface NavbarProps { isLoggedIn?: boolean }
export function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth(); // 🔴 ดึง Auth State จาก Supabase โดยตรง
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  // 🔴 ฟังก์ชัน Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); // Refresh UI ใหม่
  };

  // ดึงชื่อผู้ใช้หรืออีเมลมาแสดง
  const displayName = user?.user_metadata?.full_name || user?.email || "Account";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Music2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Conkub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-3 md:flex">
            {/* 🔴 1. Loading State */}
            {loading ? (
              <div className="flex items-center px-4 py-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : user ? (
              /* 🔴 2. Logged In State */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 font-medium">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="max-w-[150px] truncate">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" forceMount>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Ticket className="h-4 w-4" />
                    <span>My Tickets</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* 🔴 3. Login State (ยังไม่ได้ล็อกอิน) */
              <Button
                variant="outline"
                className="gap-2 text-sm font-medium"
                onClick={() => setShowLoginCard(true)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In with Google
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background md:hidden">
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
                {loading ? (
                  <div className="flex items-center justify-center py-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 font-medium">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span className="truncate">{displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginCard(true);
                    }}
                  >
                    <UserIcon className="h-4 w-4" />
                    Sign In with Google
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login Dialog */}
      <Dialog open={showLoginCard} onOpenChange={setShowLoginCard}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center text-xl font-bold">
            เข้าสู่ระบบ CONKUB
          </DialogTitle>
          <div className="py-4">
            <GoogleLoginCard open={showLoginCard} onOpenChange={setShowLoginCard} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}