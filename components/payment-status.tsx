// components/payment-status.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner"; // หรือใช้จาก "@/components/ui/use-toast" ของ shadcn ก็ได้
import { CheckCircle2, XCircle } from "lucide-react";

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // เช็คว่ามี ?success=true ส่งกลับมาจาก Stripe หรือไม่
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast.success("ชำระเงินสำเร็จ!", {
        description: "ระบบได้ทำการยืนยันที่นั่งของคุณเรียบร้อยแล้ว",
        icon: <CheckCircle2 className="text-emerald-500" />,
        duration: 5000,
      });
      // ลบ query param ออกจาก URL เพื่อไม่ให้รีเฟรชแล้วเด้งซ้ำ
      router.replace(window.location.pathname);
    }

    if (canceled) {
      toast.error("ยกเลิกการชำระเงิน", {
        description: "คุณได้ยกเลิกการทำรายการ ที่นั่งของคุณถูกยกเลิกการจองแล้ว",
        icon: <XCircle className="text-destructive" />,
      });
      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);

  return null; // Component นี้ไม่จำเป็นต้องแสดง UI อะไรบนหน้าเว็บ
}