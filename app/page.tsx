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
        <CategoryGrid />
        <FeaturedConcerts />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
