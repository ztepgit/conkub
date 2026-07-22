// components/seat-map.tsx
"use client";

import { useState, useEffect } from "react";
import { useSeats, useBookSeat } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Ticket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { GoogleLoginCard } from "@/components/google-login-card";

// ประกาศ Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SeatMapProps {
  eventId: number;
}

export function SeatMap({ eventId }: SeatMapProps) {
  // 🔴 1. ใช้ isError ตามมาตรฐาน React Query และลบ fetchError ออก
  const { data, isLoading, isError } = useSeats(eventId);
  const bookSeatMutation = useBookSeat();
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);

  // States สำหรับ Auth & UX
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // Auto-resume Booking หลัง Login กลับมา (ดักจับ Session)
  useEffect(() => {
    const checkPendingAndResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // ตรวจสอบว่าก่อน Login ได้เลือกที่นั่งค้างไว้หรือไม่
        const pending = sessionStorage.getItem("pendingBooking");
        if (pending) {
          sessionStorage.removeItem("pendingBooking"); // เคลียร์ทิ้งทันที
          const { eventId: pEventId, seatId: pSeatId } = JSON.parse(pending);
          
          setIsLoginDialogOpen(false); // ปิด Dialog
          executeBooking(pEventId, pSeatId); // ดำเนินการต่ออัตโนมัติ
        }
      }
    };

    checkPendingAndResume();

    // ฟังชั่นดักจับเมื่อ User สลับบัญชีหรือล็อกอินผ่าน Popup
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        checkPendingAndResume();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // ฟังก์ชันตรวจสอบก่อนจอง
  const handleBookClick = async () => {
    if (!selectedSeat) return toast.error("กรุณาเลือกที่นั่งก่อนทำรายการ");

    setIsCheckingSession(true);
    const { data: { session }, error } = await supabase.auth.getSession();
    setIsCheckingSession(false);

    if (error || !session) {
      // กรณียังไม่ Login -> เก็บ State ไว้ใน sessionStorage เผื่อ OAuth Redirect
      sessionStorage.setItem("pendingBooking", JSON.stringify({ eventId, seatId: selectedSeat.id }));
      setIsLoginDialogOpen(true); // เปิด Dialog
      return;
    }

    // กรณี Login แล้ว -> ยิง API เลย
    executeBooking(eventId, selectedSeat.id);
  };

  // ฟังก์ชันยิง API จริง
  const executeBooking = (eId: number, sId: number) => {
    bookSeatMutation.mutate({ eventId: eId, seatId: sId }, {
      onError: (err: any) => { 
        if (err.message === "UNAUTHORIZED") {
          // หาก Backend ปฏิเสธ (Token หมดอายุ)
          sessionStorage.setItem("pendingBooking", JSON.stringify({ eventId: eId, seatId: sId }));
          toast.error("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
          setIsLoginDialogOpen(true);
        } else {
          toast.error(err.message);
        }
      }
    });
  };

  // 🔴 2. Loading State (ใช้ UI ที่กำหนด)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mb-3 h-6 w-6 animate-spin" />
        <p>Loading seat map...</p>
      </div>
    );
  }

  // 🔴 3. Error State (ดักจับจาก isError ไม่พ่น Technical text)
  if (isError) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        Unable to load seat map. Please try again later.
      </div>
    );
  }

  const seats = data?.data || data || [];
  
  // 🔴 4. Empty State (เมื่อ API ตอบกลับสำเร็จแต่ไม่มีข้อมูลที่นั่ง)
  if (!seats || seats.length === 0) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        No seats available.
      </div>
    );
  }

  // จัดกลุ่มที่นั่งตามแถว (Row) เช่น A, B, C
  const groupedSeats = seats.reduce((acc: any, seat: any) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // เรียงลำดับแถว
  const rows = Object.keys(groupedSeats).sort();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ฝั่งซ้าย: ผังที่นั่ง */}
      <div className="flex-1 space-y-10 border rounded-2xl p-6 lg:p-10 bg-card/50">
        
        {/* หน้าเวที */}
        <div className="relative w-full max-w-2xl mx-auto h-24 bg-gradient-to-b from-primary/20 to-transparent rounded-t-[100px] flex items-center justify-center border-t-4 border-primary shadow-[0_-10px_40px_rgba(var(--primary),0.2)]">
          <span className="text-lg font-bold tracking-widest text-primary/80 uppercase">Stage</span>
        </div>

        {/* Legend (คำอธิบายสี) */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pb-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-secondary border" />
            <span>ว่าง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background" />
            <span>กำลังเลือก</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-muted opacity-50 cursor-not-allowed" />
            <span>ไม่ว่าง / ขายแล้ว</span>
          </div>
        </div>

        {/* ตารางที่นั่ง */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px] flex flex-col gap-4 items-center">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-muted-foreground">{row}</div>
                <div className="flex gap-2">
                  {groupedSeats[row]
                    .sort((a: any, b: any) => a.number - b.number)
                    .map((seat: any) => {
                      const isBooked = seat.status === "BOOKED";
                      const isSelected = selectedSeat?.id === seat.id;

                      return (
                        <button
                          key={seat.id}
                          disabled={isBooked || bookSeatMutation.isPending || isCheckingSession}
                          onClick={() => setSelectedSeat(seat)}
                          className={cn(
                            "w-10 h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-medium transition-all duration-200",
                            isBooked
                              ? "bg-muted text-muted-foreground/30 cursor-not-allowed"
                              : isSelected
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110 -translate-y-1"
                              : "bg-secondary hover:bg-primary/20 hover:text-primary border hover:border-primary/50"
                          )}
                          title={isBooked ? "จองแล้ว" : `แถว ${seat.row} เลขที่ ${seat.number} - ฿${seat.price}`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                </div>
                <div className="w-8 text-center font-bold text-muted-foreground">{row}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: สรุปการจอง */}
      <div className="w-full lg:w-[350px]">
        <Card className="sticky top-24 shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              สรุปการจอง
            </CardTitle>
            <CardDescription>เลือกที่นั่งที่ต้องการเพื่อดำเนินการต่อ</CardDescription>
          </CardHeader>
          
          <CardContent>
            {selectedSeat ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground">ที่นั่งที่เลือก</span>
                  <span className="font-bold text-lg bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {selectedSeat.row}-{selectedSeat.number}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground">ราคา</span>
                  <span className="font-bold text-lg">฿{selectedSeat.price.toLocaleString()}</span>
                </div>
                <div className="bg-secondary/50 p-3 rounded-lg flex items-start gap-3 mt-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    กรุณาตรวจสอบที่นั่งและราคาให้ถูกต้องก่อนทำการยืนยัน เมื่อยืนยันแล้วจะไม่สามารถเปลี่ยนที่นั่งได้
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                <Ticket className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">ยังไม่ได้เลือกที่นั่ง</p>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full h-12 text-base font-semibold"
              disabled={!selectedSeat || bookSeatMutation.isPending || isCheckingSession}
              onClick={handleBookClick}
            >
              {bookSeatMutation.isPending || isCheckingSession ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                "ยืนยันการจองที่นั่ง"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center text-xl font-bold">
            เข้าสู่ระบบเพื่อดำเนินการต่อ
          </DialogTitle>
          
          <div className="py-4">
            <GoogleLoginCard open={isLoginDialogOpen} 
              onOpenChange={setIsLoginDialogOpen} /> 
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            เมื่อเข้าสู่ระบบสำเร็จ ระบบจะทำการจองที่นั่งให้คุณโดยอัตโนมัติ
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}