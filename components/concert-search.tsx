// components/concert-search.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ConcertSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่าเริ่มต้นจาก URL (เผื่อผู้ใช้แชร์ลิงก์ให้กัน)
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  // ทำงานเมื่อกดปุ่ม Search Events
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    if (date.trim()) params.set("date", date.trim());

    // อัปเดต URL (Next.js จะไม่รีโหลดหน้าใหม่ แค่อัปเดต query string)
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-xl shadow-black/5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Artist or event..."
                className="h-12 bg-secondary/50 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="relative md:col-span-1">
            <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="City or venue..."
                className="h-12 bg-secondary/50 pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="relative md:col-span-1">
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="date" 
                type="date" 
                className="h-12 bg-secondary/50 pl-10" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end md:col-span-1">
            <Button
              onClick={handleSearch}
              size="lg"
              className="h-12 w-full cursor-pointer bg-gradient-to-r from-accent to-[oklch(0.55_0.25_240)] font-semibold text-white transition-all hover:opacity-90"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}