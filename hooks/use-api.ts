// hooks/use-api.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEvents, fetchSeats, bookSeat } from "@/lib/api";
import { toast } from "sonner"; // สมมติว่าใช้ sonner ตาม package.json

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}

export function useSeats(eventId: number) {
  return useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => fetchSeats(eventId),
    enabled: !!eventId, // จะไม่ยิง API ถ้ายังไม่มี eventId
  });
}

export function useBookSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, seatId }: { eventId: number; seatId: number }) =>
      bookSeat(eventId, seatId),
    onSuccess: (_, variables) => {
      // เมื่อจองสำเร็จ ให้สั่ง Invalidate เพื่อรีเฟรชข้อมูลที่นั่งใหม่ทันที (เปลี่ยนที่นั่งเป็น BOOKED)
      queryClient.invalidateQueries({ queryKey: ["seats", variables.eventId] });
      toast.success("Booking successful!");
    },
    onError: (error: any) => {
      // ดักจับ Error จาก Go เช่น "seat already booked" แล้วแจ้งเตือนผู้ใช้
      toast.error(error.message || "Failed to book the seat. Please try again.");
    },
  });
}