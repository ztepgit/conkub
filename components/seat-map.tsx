"use client";

import { useState } from "react";
import { useSeats, useBookSeat } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatMapProps {
  eventId: number;
}

export function SeatMap({ eventId }: SeatMapProps) {
  const { data, isLoading, error } = useSeats(eventId);
  const { mutate: book, isPending } = useBookSeat();
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">กำลังโหลดผังที่นั่ง...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive bg-destructive/10 rounded-lg">
        <p>เกิดข้อผิดพลาดในการโหลดผังที่นั่ง กรุณาลองใหม่อีกครั้ง</p>
      </div>
    );
  }

  const seats = data?.data || [];
  
  // จัดกลุ่มที่นั่งตามแถว (Row) เช่น A, B, C
  const groupedSeats = seats.reduce((acc: any, seat: any) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // เรียงลำดับแถว
  const rows = Object.keys(groupedSeats).sort();

  const handleBook = () => {
    if (!selectedSeat) return;
    book(
      { eventId, seatId: selectedSeat.id },
      {
        onSuccess: () => {
          setSelectedSeat(null);
        },
      }
    );
  };

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
                          disabled={isBooked || isPending}
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
              disabled={!selectedSeat || isPending}
              onClick={handleBook}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังล็อคที่นั่ง...
                </>
              ) : (
                "ยืนยันการจองที่นั่ง"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}