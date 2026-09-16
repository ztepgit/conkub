// components/about-us.tsx
import { Music2, Ticket, ShieldCheck, Heart, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutUs() {
    const coreValues = [
        {
            icon: Ticket,
            title: "Easy & Convenient Booking",
            description: "A seat booking system designed to be fast, intuitive, and real-time, ensuring you never miss the best seats."
        },
        {
            icon: ShieldCheck,
            title: "100% Safe & Secure",
            description: "Every transaction is processed through world-class payment standards, equipped with robust fraud protection."
        },
        {
            icon: Heart,
            title: "Dedicated to Every Experience",
            description: "We believe concerts are unforgettable memories. We are committed to providing the best service from booking to the moment you enter the event."
        }
    ];

    const stats = [
        { value: "500+", label: "Concerts Hosted" },
        { value: "1M+", label: "Trusted Users" },
        { value: "50+", label: "Event Partners" },
        { value: "99.9%", label: "Satisfaction Rate" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 bg-muted/30 overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                <div className="container relative mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 text-primary">
                        <Music2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Connecting you to the <br className="hidden md:block" />
                        <span className="text-primary">Rhythm of Music</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Founded on a passion for music, Conkub is the ultimate concert ticketing platform that brings every musical experience into one place, making it easier than ever for fans to reach their favorite artists.
                    </p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="container mx-auto px-4 py-20 md:py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose Conkub?</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Our goal is to create a new standard for the concert ticketing industry in Thailand.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {coreValues.map((value, index) => (
                        <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center space-y-2">
                                <span className="text-4xl md:text-5xl font-black tracking-tighter">
                                    {stat.value}
                                </span>
                                <span className="text-sm md:text-base text-primary-foreground/80 font-medium">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team / Closing Section */}
            <section className="container mx-auto px-4 py-20 md:py-32 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <Sparkles className="w-12 h-12 mx-auto text-amber-500" />
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Let's Build Great Experiences Together
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Whether you are a music fan searching for dream concert tickets, or an organizer looking for a trusted ticketing platform, the Conkub team is here to support you at every step.
                    </p>
                </div>
            </section>
        </div>
    );
}