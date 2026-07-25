// components/featured-concerts.tsx
"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConcertCard } from "./concert-card";
import { useEvents } from "@/hooks/use-api";

export function FeaturedConcerts() {
  // 🔴 1. เพิ่ม isError มารับสถานะ (Axios จะ Trigger isError ให้อัตโนมัติเมื่อ Request พัง)
  const { data: eventsResponse, isLoading, isError } = useEvents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 🔴 2. เพิ่ม Error State เพื่อจัดการกรณี Axios โยน Error กลับมา
  if (isError) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px] text-muted-foreground">
        Unable to load data.
      </div>
    );
  }

  // รับค่าจาก Backend (รองรับทั้งแบบมี .data ครอบ และแบบส่ง Array มาตรงๆ)
  const events = eventsResponse?.data || eventsResponse || [];

  // 🔴 3. เพิ่ม Empty State กรณีที่ API ตอบกลับสำเร็จแต่ไม่มีข้อมูล
  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px] text-muted-foreground">
        No concerts available.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Concerts
          </h2>
          <p className="text-muted-foreground">
            {"Don't miss out on these trending events"}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          View All Events
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event: any) => (
          <ConcertCard
            key={event.id}
            concert={{
              id: event.id,
              title: event.name,
              artist: event.artist,
              date: new Date(event.show_time).toLocaleDateString('th-TH'),
              time: new Date(event.show_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
              venue: event.venue,
              image: event.image_url || "/placeholder.jpg",
              category: event.category,
              price: 2500, // อนาคตสามารถปรับไปดึงราคาต่ำสุดของงานจาก backend ได้
              remainingTickets: event.remainingTickets
            }}
          />
        ))}
      </div>
    </section>
  );
}