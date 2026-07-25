import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";

const homeLinks = [
  { href: "/#building", label: "Building" },
  { href: "/#experience", label: "Experience" },
  { href: "/#talks", label: "Talks" },
  { href: "/advisory", label: "Advisory" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const onAdvisory = location.pathname === "/advisory";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`navbar sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-background/95 py-3 shadow-subtle backdrop-blur" : "py-4 sm:py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-semibold sm:text-2xl">
          {data.name}
        </Link>

        <nav className="hidden items-center space-x-6 md:flex lg:space-x-8">
          {homeLinks.map((link) =>
            link.href.startsWith("/#") || link.href === "/" ? (
              <a
                key={link.href}
                href={onAdvisory ? link.href : link.href.replace(/^\//, "")}
                className="link-hover min-h-11 inline-flex items-center text-sm font-medium"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`link-hover min-h-11 inline-flex items-center text-sm font-medium ${
                  onAdvisory && link.href === "/advisory" ? "text-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X size={24} aria-hidden />
          ) : (
            <Menu size={24} aria-hidden />
          )}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-border/40 absolute left-0 right-0 top-full z-50 border-b bg-background animate-fade-in md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="container flex flex-col space-y-1 px-4 py-4">
            {homeLinks.map((link) => {
              const isRoute = link.href === "/advisory";
              const className =
                "min-h-11 py-3 text-lg font-medium flex items-center";
              if (isRoute) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={className}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={onAdvisory ? link.href : link.href.replace(/^\//, "")}
                  className={className}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
