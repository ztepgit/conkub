import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, Info } from "lucide-react";
import { SeatMap } from "@/components/seat-map"; // นำเข้า SeatMap ที่เราสร้างไว้
import { format } from "date-fns";
import { th } from "date-fns/locale"; // สำหรับแสดงวันที่ภาษาไทย

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  // ใน Next.js 15+ (App Router) params จะเป็น Promise 
  const resolvedParams = await params;
  const eventId = Number(resolvedParams.id);

  if (isNaN(eventId)) {
    notFound();
  }

  // 🔴 หมายเหตุ: ในโปรเจกต์จริง คุณจะต้องเรียก API เพื่อดึงรายละเอียดงาน 1 งาน
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`);
  // const eventData = await res.json();
  
  // 🟢 สำหรับตอนนี้ ผมจำลองข้อมูล (Mock Data) ให้เห็นโครงสร้าง UI ไปก่อน
  const eventData = {
    id: eventId,
    name: "Conkub Music Festival 2026",
    description: "เทศกาลดนตรีที่ยิ่งใหญ่ที่สุดแห่งปี รวบรวมศิลปินชั้นนำระดับประเทศไว้ในงานเดียว พร้อมโปรดักชั่นจัดเต็มแสงสีเสียงสุดอลังการที่คุณไม่ควรพลาด!",
    venue: "Impact Arena, Muang Thong Thani",
    showTime: new Date("2026-12-31T18:00:00Z"), // เวลาจัดงาน
    imageUrl: "/placeholder.jpg", // ใช้รูป placeholder ที่มีในโปรเจกต์
  };

  return (
    <main className="min-h-screen pb-20">
      {/* 1. Hero Section (แสดงรายละเอียดงาน) */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-muted overflow-hidden">
        {/* รูปพื้นหลัง */}
        <Image
          src={eventData.imageUrl}
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
                Live Concert
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {eventData.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground pt-2">
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {format(eventData.showTime, "d MMMM yyyy", { locale: th })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {format(eventData.showTime, "HH:mm", { locale: th })} น.
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
          <p className="text-muted-foreground leading-relaxed">
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