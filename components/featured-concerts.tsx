// components/featured-concerts.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConcertCard } from "./concert-card";
import { useEvents } from "@/hooks/use-api";

export function FeaturedConcerts() {
  const searchParams = useSearchParams();
  
  // แกะค่าที่ถูกกรอกไว้บน URL เพื่อนำไปดึง Data
  const filters = {
    search: searchParams.get("search") || undefined,
    location: searchParams.get("location") || undefined,
    date: searchParams.get("date") || undefined,
  };

  const { data: eventsResponse, isLoading, isError } = useEvents(filters);
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

      {/* Render เนื้อหาตาม State ของ Data */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-20 text-red-500">
          Failed to load events.
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <h3 className="text-xl font-semibold mb-2">No events found.</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
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
                price: event.price,
                remainingTickets: event.remainingTickets
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}