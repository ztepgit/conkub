// lib/api.ts
import { createBrowserClient } from "@supabase/ssr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ฟังก์ชันดึง Token จาก Supabase (ฝั่ง Client)
async function getAuthToken() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

// 1. ดึงรายการคอนเสิร์ต (Public)
export async function fetchEvents() {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

// 2. ดึงรายการที่นั่ง (Public)
export async function fetchSeats(eventId: number) {
  const res = await fetch(`${API_URL}/events/${eventId}/seats`);
  if (!res.ok) throw new Error("Failed to fetch seats");
  return res.json();
}

// 3. จองที่นั่ง (Protected - ต้องใช้ Token)
export async function bookSeat(eventId: number, seatId: number) {
  const token = await getAuthToken();
  if (!token) throw new Error("Unauthorized: Please login first");

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // แนบ JWT ไปให้ Go ตรวจสอบ
    },
    body: JSON.stringify({ event_id: eventId, seat_id: seatId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to book seat");
  }
  return res.json();
}