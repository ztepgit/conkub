"use client";

import Link from "next/link";
import { Music2, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

// footerLinks ใหม่
const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" }, // 🔴 ลิงก์นี้จะกดได้ปกติ
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Music2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Conkub</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your premier destination for discovering and booking live concert experiences
              across the country.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      // 🔴 แก้ไขตรงนี้: ให้บล็อกเฉพาะลิงก์ที่ไม่ใช่ /about
                      onClick={(e) => {
                        if (link.href !== "/about") {
                          e.preventDefault();
                        }
                      }}
                      className="text-sm cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Conkub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}