// components/seat-map.tsx
"use client";

import { useState, useEffect } from "react";
import { useSeats, useBookSeat } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { GoogleLoginCard } from "@/components/google-login-card";

// 🔴 เพิ่ม Type รองรับ
interface Seat {
  id: number;
  row: string;
  number: number;
  seat_type: string;
  price: number;
  status: string;
}

interface SeatMapProps {
  eventId: number;
}

export function SeatMap({ eventId }: SeatMapProps) {
  const { data, isLoading, isError } = useSeats(eventId);
  const bookSeatMutation = useBookSeat();
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // State ควบคุม Dialog สำหรับ GoogleLoginCard
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // ============================================================================
  // รับฟัง Event "auth:required" จาก Axios Interceptor เพื่อเปิด Dialog อัตโนมัติ
  // ============================================================================
  useEffect(() => {
    const handler = () => {
      setIsLoginDialogOpen(true);
    };

    window.addEventListener("auth:required", handler);
    return () => {
      window.removeEventListener("auth:required", handler);
    };
  }, []);

  // ============================================================================
  // ตรวจสอบ Session ก่อนเรียก Protected API
  // ============================================================================
  const handleBookClick = async () => {
    if (!selectedSeat) {
      toast.error("กรุณาเลือกที่นั่งก่อนทำรายการ");
      return;
    }

    setIsCheckingSession(true);
    // เช็ค Session จาก Supabase ก่อนเสมอ
    const { data: { session }, error } = await supabase.auth.getSession();
    setIsCheckingSession(false);

    // หากไม่มี Session ให้เปิด Dialog GoogleLoginCard แล้ว return ทันที
    if (error || !session) {
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({ eventId, seatId: selectedSeat.id })
      );
      setIsLoginDialogOpen(true);
      return; // return ทันที ห้ามเรียก mutate() / ห้ามยิง POST /bookings
    }

    // หากเข้าสู่ระบบแล้ว จึงจะเรียก Protected API
    bookSeatMutation.mutate({ eventId, seatId: selectedSeat.id });
  };

  // Auto-resume Booking หลังล็อกอินสำเร็จกลับมา (คง Business Logic เดิม)
  useEffect(() => {
    const checkPendingAndResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const pending = sessionStorage.getItem("pendingBooking");
        if (pending) {
          sessionStorage.removeItem("pendingBooking");
          const { eventId: pEventId, seatId: pSeatId } = JSON.parse(pending);
          setIsLoginDialogOpen(false);
          bookSeatMutation.mutate({ eventId: pEventId, seatId: pSeatId });
        }
      }
    };

    checkPendingAndResume();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        checkPendingAndResume();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mb-3 h-6 w-6 animate-spin" />
        <p>Loading seat map...</p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        Unable to load seat map. Please try again later.
      </div>
    );
  }

  const seats: Seat[] = data?.data || data || [];

  // Empty State
  if (!seats || seats.length === 0) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        No seats available.
      </div>
    );
  }

  // จัดกลุ่มที่นั่งตามแถว (Row)
  const groupedSeats = seats.reduce((acc: any, seat: Seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(groupedSeats).sort();

  // 🔴 หา ราคาของ VIP และ Regular สำหรับแสดงใน Legend
  const vipPrice = seats.find(s => s.seat_type === "VIP")?.price || 0;
  const regPrice = seats.find(s => s.seat_type === "REGULAR")?.price || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ฝั่งซ้าย: ผังที่นั่ง */}
      <div className="flex-1 space-y-10 border rounded-2xl p-6 lg:p-10 bg-card/50">
        
        {/* Stage ดำเงา */}
        <div className="relative w-full max-w-3xl mx-auto h-24 md:h-32 rounded-[2rem] bg-black shadow-[inset_0_2px_8px_rgba(255,255,255,0.15),_0_10px_20px_rgba(0,0,0,0.2)] border border-white/10 mb-8 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-black tracking-[0.5em] text-white/90 ml-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              STAGE
            </span>
          </div>
        </div>

        {/* 🔴 Legend ปรับปรุงใหม่ */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pb-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500/90 shadow-sm border border-amber-600/20" />
            <span>VIP {vipPrice > 0 && `— ฿${vipPrice.toLocaleString()}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-secondary border" />
            <span>Regular {regPrice > 0 && `— ฿${regPrice.toLocaleString()}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background" />
            <span>กำลังเลือก</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-muted opacity-50" />
            <span>ไม่ว่าง / ขายแล้ว</span>
          </div>
        </div>

        {/* ตารางที่นั่ง */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px] flex flex-col gap-4 items-center pt-2">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-muted-foreground">{row}</div>
                <div className="flex gap-2">
                  {groupedSeats[row]
                    .sort((a: Seat, b: Seat) => a.number - b.number)
                    .map((seat: Seat) => {
                      const isBooked = seat.status === "BOOKED";
                      const isSelected = selectedSeat?.id === seat.id;
                      const isVIP = seat.seat_type === "VIP"; // 🔴 เช็คประเภทจาก API

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
                                : isVIP
                                  ? "bg-amber-500/90 hover:bg-amber-500 text-white hover:shadow-md hover:shadow-amber-500/20 border-transparent"
                                  : "bg-secondary hover:bg-primary/20 hover:text-primary border hover:border-primary/50"
                          )}
                          title={isBooked ? "จองแล้ว" : `[${seat.seat_type}] แถว ${seat.row} เลขที่ ${seat.number} - ฿${seat.price.toLocaleString()}`}
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
                
                {/* 🔴 ส่วนแสดงประเภทที่นั่ง */}
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                  <span className="text-muted-foreground">ประเภท</span>
                  <span className={cn("font-bold text-sm px-2 py-1 rounded-md", 
                    selectedSeat.seat_type === "VIP" ? "bg-amber-100 text-amber-700" : "bg-secondary text-secondary-foreground"
                  )}>
                    {selectedSeat.seat_type}
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

      {/* Google Login Modal */}
      <GoogleLoginCard open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </div>
  );
}