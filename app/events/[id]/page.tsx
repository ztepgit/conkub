// app/events/[id]/page.tsx
"use client"; // 🔴 1. เปลี่ยนเป็น Client Component เพื่อใช้งาน React Query

import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, Info, Loader2 } from "lucide-react"; // 🔴 เพิ่ม Loader2
import { SeatMap } from "@/components/seat-map";

import { PaymentStatus } from "@/components/payment-status";
import { Suspense, use } from "react"; // 🔴 นำเข้า use สำหรับแกะค่า Promise ใน Client Component
import { useEvent } from "@/hooks/use-api"; // 🔴 นำเข้า API Hook

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventPageProps) {
  // ใน Next.js 15+ (App Router) ฝั่ง Client Component ให้ใช้ React.use() แกะค่า Promise
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);

  if (isNaN(eventId)) {
    notFound();
  }

  // 🔴 2. เลิกใช้ Mock Data และเรียก API จริงผ่าน Hook
  const { data: eventDataResponse, isLoading, isError } = useEvent(eventId);

  // 🔴 3. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        <p>Loading...</p>
      </div>
    );
  }

  // 🔴 4. Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        Unable to load data.
      </div>
    );
  }

  const eventData = eventDataResponse?.data || eventDataResponse;

  // 🔴 5. Empty State
  if (!eventData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-muted-foreground">
        No concerts available.
      </div>
    );
  }

  // สร้าง String วันที่และเวลาเพื่อนำไปแสดงผลตรงๆ
  const showDate = new Date(eventData.show_time);
  const showTimeText = showDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const showTimeClock = showDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

  return (
    <main className="min-h-screen pb-20">
      {/* วางตัวจับสถานะไว้ในหน้านี้ (ห่อด้วย Suspense เพราะใช้ useSearchParams) */}
      <Suspense fallback={null}>
        <PaymentStatus />
      </Suspense>

      {/* 1. Hero Section (แสดงรายละเอียดงาน) */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-muted overflow-hidden">
        {/* รูปพื้นหลัง */}
        <Image
          src={eventData.image_url || "/placeholder.jpg"}
          alt={eventData.name}
          fill
          className="object-cover opacity-40 blur-sm mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        {/* ข้อมูลคอนเสิร์ตที่ทับอยู่บนรูป */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 lg:pb-16">
            <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full uppercase tracking-wider">
                {eventData.category || "Live Concert"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {eventData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground pt-2">
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {/* ดึง String มาแสดงตรงๆ แทนการใช้ format() */}
                    {showTimeText}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {/* ดึง String มาแสดงตรงๆ แทนการใช้ format() */}
                    {showTimeClock}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{eventData.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content & Seat Map Section */}
      <section className="container mx-auto px-4 py-12 space-y-16">

        {/* รายละเอียดเพิ่มเติม */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            เกี่ยวกับงานนี้
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {eventData.description}
          </p>
        </div>

        {/* ระบบจองที่นั่ง */}
        <div id="booking-section" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">เลือกระบุโซนและที่นั่ง</h2>
            <p className="text-muted-foreground">
              กรุณาเลือกที่นั่งที่คุณต้องการเพื่อดำเนินการเข้าสู่ระบบและชำระเงิน
            </p>
          </div>

          {/* เรียกใช้ Component SeatMap ตรงนี้ โดยส่ง eventId เข้าไป */}
          <SeatMap eventId={eventId} />
        </div>

      </section>
    </main>
  );
}