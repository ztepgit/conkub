// hooks/use-api.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEvents, getEventById, getSeats, bookSeat } from "@/lib/api";

// ==========================================
// 🟢 PUBLIC API (ไม่ต้องใช้ Token)
// ==========================================
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });
}

export function useEvent(eventId: number) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });
}

export function useSeats(eventId: number) {
  return useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => getSeats(eventId),
    enabled: !!eventId,
  });
}

// ==========================================
// 🔴 PROTECTED API (ต้องใช้ Token)
// ==========================================
export function useBookSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, seatId }: { eventId: number; seatId: number }) => {
      return await bookSeat(eventId, seatId);
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
    // 🔴 โยน Error ตามปกติโดยไม่ต้องใส่ onError หรือเปิด Dialog จาก Hook นี้
    // เพราะ Axios Response Interceptor ใน lib/api.ts จะเป็นผู้จัดการ 401 Unauthorized และยิง Event "auth:required" ให้อัตโนมัติ
  });
}