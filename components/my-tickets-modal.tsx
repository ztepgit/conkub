// components/my-tickets-modal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Ticket, Calendar, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

interface MyTicketsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyTicketsModal({ open, onOpenChange }: MyTicketsModalProps) {
  const { user } = useAuth();

  // ดึงข้อมูลตั๋วจาก Backend
  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const res = await fetch(`${apiUrl}/bookings/me`, {
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
    enabled: !!user && open, // โหลดข้อมูลก็ต่อเมื่อเปิด Modal และมี User
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Ticket className="w-5 h-5 text-primary" />
            ตั๋วคอนเสิร์ตของฉัน
          </DialogTitle>
        </DialogHeader>

        {/* 🔴 ส่วนที่ปรับปรุง: เพิ่ม max-h และ overflow-y-auto เพื่อให้ Scroll ได้เมื่อตั๋วมีหลายใบ */}
        <div className="py-2 flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p>กำลังโหลดตั๋วของคุณ...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              <p>ติดต่อเซิร์ฟเวอร์ไม่ได้</p>
            </div>
          ) : tickets?.data?.length === 0 || !tickets?.data ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
              <p>ไม่พบตั๋วของคุณในระบบ</p>
            </div>
          ) : (
            tickets.data.map((ticket: any) => (
              /* 🔴 ปรับสีพื้นหลังการ์ดเป็นสีน้ำเงิน Google และปรับสีตัวหนังสือเป็นสีขาวให้กลมกลืน */
              <div key={ticket.id} className="p-4 border-0 rounded-xl bg-[#4285F4] text-black shadow-md flex flex-col gap-2">
                <h3 className="font-bold text-lg leading-tight drop-shadow-sm">{ticket.event_name}</h3>

                <div className="flex flex-col gap-1.5 text-sm text-black mt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>{new Date(ticket.show_time).toLocaleString("th-TH")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>{ticket.venue}</span>
                  </div>

                  {/* กรอบแสดงโซนและที่นั่งแบบเด่นขึ้นมา เพื่อความสวยงาม */}
                  <div className="flex items-center gap-2 font-medium mt-2 bg-blue-700/30 p-2.5 rounded-lg border border-blue-400/30">
                    <Ticket className="w-4 h-4 shrink-0 text-black" />
                    <span className="text-black">
                      โซน: {ticket.seat_type} | แถว: {ticket.row} เลขที่: {ticket.number}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}