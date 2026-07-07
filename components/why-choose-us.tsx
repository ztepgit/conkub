import { Zap, Shield, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Get your tickets in seconds with our streamlined booking process. No waiting, no hassle.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your transactions are protected with bank-level encryption and fraud protection.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Events",
    description:
      "Every event on our platform is verified and backed by our satisfaction guarantee.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose ConcertHub
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We make finding and booking your next concert experience simple, secure, and
            stress-free
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-accent/50 hover:shadow-lg"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
