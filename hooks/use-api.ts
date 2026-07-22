// hooks/use-api.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSeats } from "@/lib/api"; 
import { toast } from "sonner"; // สมมติว่าใช้ sonner ตาม package.json
import { createClient } from "@supabase/supabase-js"; // 🔴 Import Supabase Client ของคุณ

// สมมติฐานว่าคุณประกาศ Client ไว้แบบนี้ หรือดึงมาจาก /lib/supabase ของคุณ
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 🟢 PUBLIC API (ไม่ต้องใช้ Token)
// ==========================================
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // 🔴 เปลี่ยนมายิง API จริงตามที่คุณต้องการ
      const res = await fetch("http://localhost:8080/api/v1/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });
}

export function useSeats(eventId: number) {
  return useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => fetchSeats(eventId),
    enabled: !!eventId, // จะไม่ยิง API ถ้ายังไม่มี eventId
  });
}

// ==========================================
// 🔴 PROTECTED API (ต้องใช้ Token)
// ==========================================
export function useBookSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, seatId }: { eventId: number; seatId: number }) => {
      // 1. เช็ค Session ปัจจุบันจาก Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        throw new Error("UNAUTHORIZED"); // โยน Keyword เพื่อให้ UI ดักจับได้ง่าย
      }

      // 2. ยิง API พร้อมแนบ Bearer Token
      const res = await fetch("http://localhost:8080/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ eventId, seatId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("UNAUTHORIZED"); // Backend ตรวจเจอว่า Token หมดอายุ/ไม่ถูกต้อง
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to book the seat. Please try again.");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      // เมื่อจองสำเร็จ ให้สั่ง Invalidate เพื่อรีเฟรชข้อมูลที่นั่งใหม่ทันที (เปลี่ยนที่นั่งเป็น BOOKED)
      queryClient.invalidateQueries({ queryKey: ["seats", variables.eventId] });
      toast.success("กำลังพาท่านเข้าสู่ระบบชำระเงิน...");
      
      // ถ้า Backend คืน url ของ Stripe กลับมา ให้ Redirect ไปจ่ายเงิน
      if (data.url) {
        window.location.href = data.url;
      }
    },
    // หมายเหตุ: onError สำหรับเคสอื่นๆ และ UNAUTHORIZED ถูกส่งไปจัดการต่อที่ Component (UI) เพื่อเปิด Dialog
  });
}