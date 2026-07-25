// lib/api.ts
import axios from "axios";
import { createBrowserClient } from "@supabase/ssr";

// สร้าง Supabase Client (ใช้จาก V1 เพราะรองรับ Next.js Client Component ได้ดีกว่า)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. สร้าง Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ระบุเป็น http://localhost:8080/api/v1 ใน .env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Request Interceptor (ดึง Token แนบให้อัตโนมัติทุก Request)
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // ถ้ามี session ให้แนบ Bearer Token
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (จัดการ Error กลาง)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // โยน Error กลับไปให้ UI (Component) จัดการ ห้ามมี UI Logic ตรงนี้
    if (error.response?.status === 401) {
      return Promise.reject(new Error("UNAUTHORIZED"));
    }
    
    // จัดรูปแบบ Error ให้ตรงกับที่ Backend ส่งมา
    const errorMessage = error.response?.data?.error || error.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
    return Promise.reject(new Error(errorMessage));
  }
);

// ==========================================
// 4. Export API Functions (คืนค่าเฉพาะ response.data)
// ==========================================

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventById = async (id: number) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getSeats = async (eventId: number) => {
  const response = await api.get(`/events/${eventId}/seats`);
  return response.data;
};

export const bookSeat = async (eventId: number, seatId: number) => {
  // คงรูปแบบ key เป็น event_id และ seat_id ตาม V1 เผื่อ Backend Go รับค่าเป็น snake_case
  const response = await api.post("/bookings", { 
    event_id: eventId, 
    seat_id: seatId 
  });
  return response.data;
};