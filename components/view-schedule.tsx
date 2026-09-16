// components/view-schedule.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEvents } from "@/hooks/use-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket, Loader2, ChevronRight } from "lucide-react";

export function ViewSchedule() {
  // ดึงข้อมูลคอนเสิร์ตทั้งหมดผ่าน API
  const { data, isLoading, isError } = useEvents();

  // สถานะกำลังโหลด
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>กำลังโหลดตารางงาน...</p>
      </div>
    );
  }

  // สถานะเกิดข้อผิดพลาด
  if (isError) {
    return (
      <div className="flex justify-center items-center py-20 text-destructive">
        <p>ไม่สามารถโหลดข้อมูลตารางงานได้ กรุณาลองใหม่อีกครั้ง</p>
      </div>
    );
  }

  const events = data?.data || data || [];

  // สถานะไม่มีข้อมูล
  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
        <p>ยังไม่มีคอนเสิร์ตในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <h2 className="text-3xl mt-4 md:text-4xl font-black text-center mb-8  text-primary drop-shadow-sm">
        Schedule
      </h2>

      <div className="flex flex-col gap-5">
        {events.map((event: any) => {
          // จัดฟอร์แมตวันที่และเวลาให้อ่านง่าย
          const showDate = new Date(event.show_time);
          const dateText = showDate.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const timeText = showDate.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " น.";

          return (
            <Link key={event.id} href={`/events/${event.id}`} className="block group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/40 bg-card/50 backdrop-blur-sm">
                
                {/* แก้ไขการเว้นระยะขอบ (Padding) และช่องว่าง (Gap) ระหว่างรูปกับเนื้อหา */}
                <div className="flex flex-col sm:flex-row p-4 md:p-5 gap-5 md:gap-6">
                  
                  {/* ส่วนรูปภาพ (ซ้าย) - เพิ่ม rounded-xl เพื่อไม่ให้ติดขอบ */}
                  <div className="relative w-full sm:w-48 md:w-64 h-56 sm:h-auto shrink-0 overflow-hidden bg-muted rounded-xl shadow-sm">
                    <Image
                      src={event.image_url || "/placeholder.jpg"}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Badge หมวดหมู่สำหรับ Mobile */}
                    <div className="absolute top-3 left-3 sm:hidden">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-md shadow-sm">
                        {event.category || "Live Concert"}
                      </Badge>
                    </div>
                  </div>

                  {/* ส่วนรายละเอียด (ขวา) - ปรับลด Padding ลงเพราะตัวกล่องใหญ่มี Padding แล้ว */}
                  <div className="flex flex-col flex-1 justify-between gap-4 py-1 sm:pr-2">
                    <div className="space-y-3">
                      <div className="hidden sm:flex justify-between items-start">
                        <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary bg-primary/5">
                          {event.category || "Live Concert"}
                        </Badge>
                        {event.price > 0 && (
                          <div className="flex items-center text-primary font-bold text-sm bg-primary/10 px-2.5 py-1 rounded-md">
                            <Ticket className="w-4 h-4 mr-1.5" />
                            เริ่มต้น ฿{event.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      {/* ชื่อและศิลปิน */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-muted-foreground font-medium text-sm md:text-base line-clamp-1 mt-1">
                          {event.artist}
                        </p>
                      </div>

                      {/* ข้อมูลเวลาและสถานที่ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2 shrink-0 text-foreground/50" />
                          <span>{dateText}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 shrink-0 text-foreground/50" />
                          <span>{timeText}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground sm:col-span-2">
                          <MapPin className="w-4 h-4 mr-2 shrink-0 text-foreground/50" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* ส่วนปุ่มและราคา (สำหรับ Mobile) */}
                    <div className="flex items-center justify-between sm:justify-end mt-2 pt-4 border-t sm:border-t-0 border-border/50">
                      <div className="sm:hidden flex items-center text-primary font-bold text-lg">
                        <Ticket className="w-5 h-5 mr-1.5" />
                        ฿{event.price?.toLocaleString() || "0"}
                      </div>
                      
                      <Button 
                        variant="secondary" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 cursor-pointer pl-5 pr-4"
                      >
                        ดูรายละเอียด
                        <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Button>
                    </div>
                  </div>
                  
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}