import { Guitar, Music, Sparkles, Zap, Mic, Music2 } from "lucide-react";
import { categories } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  Guitar: <Guitar className="h-6 w-6" />,
  Music: <Music className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Mic: <Mic className="h-6 w-6" />,
  Music2: <Music2 className="h-6 w-6" />,
};

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Popular Categories
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Explore concerts by your favorite music genre
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className="group relative flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-accent group-hover:text-white">
              {iconMap[category.icon]}
            </div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.count} events
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
