"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-[oklch(0.55_0.25_240)] px-6 py-16 text-center sm:px-12 lg:px-20">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Never Miss a Beat
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            Subscribe to our newsletter and be the first to know about new concerts,
            exclusive presales, and special offers.
          </p>

          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 bg-white pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-foreground px-8 font-semibold text-background hover:bg-foreground/90"
            >
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-sm text-white/60">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
