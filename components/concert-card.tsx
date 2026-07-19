// components/concert-card.tsx
import Image from "next/image";
import Link from "next/link"; // 🔴 1. เพิ่ม import Link
import { MapPin, Calendar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Concert } from "@/lib/data";

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  const isLowStock = concert.remainingTickets < 50;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={concert.image}
          alt={concert.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute right-3 top-3 bg-white/90 text-foreground backdrop-blur-sm"
        >
          {concert.category}
        </Badge>

        {/* Low Stock Badge */}
        {isLowStock && (
          <Badge className="absolute left-3 top-3 bg-red-500 text-white">
            Only {concert.remainingTickets} left!
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold group-hover:text-accent">
          {concert.title}
        </h3>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          {concert.artist}
        </p>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{concert.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {concert.date} • {concert.time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-xl font-bold">${concert.price}</p>
          </div>
          {/* 🔴 2. ครอบปุ่มด้วย Link เพื่อพาไปหน้ารายละเอียดคอนเสิร์ต */}
          <Link href={`/events/${concert.id}`}>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Ticket className="h-4 w-4" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}