"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Loader2 } from "lucide-react"; // เพิ่ม Loader2

interface GoogleLoginCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleLoginCard({ open, onOpenChange }: GoogleLoginCardProps) {
  // 1. เพิ่ม Loading State ป้องกันการกดเบิ้ล
  const [isLoading, setIsLoading] = useState(false);

  // 2. ฟังก์ชันจัดการ Google Login แบบ Production-ready
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      // สร้าง Client ภายในฟังก์ชัน หรือ Component เพื่อให้ปลอดภัยกับ SSR และดึง Env ล่าสุด
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // ใช้ window.location.origin เพื่อรองรับ Vercel Preview Deployments อัตโนมัติโดยไม่ต้องฮาร์ดโค้ด
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      // ตรงนี้หาก UI มี Toast (เช่น sonner) สามารถเรียก toast.error("Login failed") ได้เลย
    } finally {
      setIsLoading(false); // ปลดโหลดในกรณีที่ error (ถ้าสำเร็จมันจะ redirect หน้าไปเลย)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-2xl font-semibold">Welcome back</DialogTitle>
          <DialogDescription>
            Sign in to your account to continue booking tickets
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">

          {/* 3. ผูก Event และ Loading State ที่ปุ่ม Google Login */}
          <Button
            variant="outline"
            className="w-full gap-3 py-6 text-base font-medium"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email Login Form (เว้นไว้ตามเดิม ไม่แก้) */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="name@example.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-primary py-6 text-base font-medium text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <button className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}