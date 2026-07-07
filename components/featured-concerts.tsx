import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConcertCard } from "./concert-card";
import { concerts } from "@/lib/data";

export function FeaturedConcerts() {
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
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </div>
    </section>
  );
}
