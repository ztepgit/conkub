//app/page.tsx

export const dynamic = 'force-dynamic'; // บังคับให้ดึงข้อมูลใหม่ทุกครั้ง (ไม่จำลองหน้าตอน Build)

import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { ConcertSearch } from "@/components/concert-search";
import { CategoryGrid } from "@/components/category-grid";
import { FeaturedConcerts } from "@/components/featured-concerts";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroBanner />
        <ConcertSearch />
        <FeaturedConcerts />
        <CategoryGrid />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
