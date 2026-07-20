// components/featured-concerts.tsx
"use client"; // 🔴 1. เติม use client เพราะมีการใช้ hook (useEvents)

import { ArrowRight, Loader2 } from "lucide-react"; // 🔴 เพิ่ม Loader2
import { Button } from "@/components/ui/button";
import { ConcertCard } from "./concert-card";
import { useEvents } from "@/hooks/use-api"; // 🔴 2. Import hook ดึงข้อมูล

export function FeaturedConcerts() {
  const { data: eventsResponse, isLoading } = useEvents();

  // 🔴 3. เพิ่มสถานะตอนกำลังโหลดข้อมูล
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 🔴 4. รับค่าจาก Backend (รองรับทั้งแบบมี .data ครอบ และแบบส่ง Array มาตรงๆ)
  const events = eventsResponse?.data || eventsResponse || [];

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
        {/* 🔴 5. เปลี่ยนจาก mock data (concerts) เป็นข้อมูลจาก API (events) พร้อมจัด Format */}
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