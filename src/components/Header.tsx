import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";

/** Mirrors the order of the sections on the home page. */
const navLinks = [
  { href: "/#experience", label: "Experience" },
  { href: "/#building", label: "Building" },
  { href: "/learn", label: "Knowledge" },
  { href: "/tools", label: "Toolkit" },
  { href: "/advisory", label: "Advisory" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const renderLink = (
    link: (typeof navLinks)[number],
    className: string,
    onClick?: () => void,
  ) => {
    if (link.href.includes("#")) {
      return (
        <a
          key={link.href}
          href={isHome ? link.href.replace(/^\//, "") : link.href}
          className={className}
          onClick={onClick}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.href}
        to={link.href}
        className={`${className} ${
          location.pathname === link.href ? "text-primary" : ""
        }`}
        onClick={onClick}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header
      /*
       * The padding does not change with scroll any more. It used to shrink,
       * which moved every sticky element under the header by 8px the moment you
       * started scrolling — visible as a jump on the knowledge-base nav, and a
       * layout shift on every page. Only the surface reacts now.
       */
      className={`border-border/40 sticky top-0 z-40 h-[var(--header-h)] w-full border-b backdrop-blur-md transition-shadow duration-300 ${
        isScrolled ? "bg-background/95 shadow-subtle" : "bg-background/80"
      }`}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-semibold sm:text-2xl">
          {data.name}
        </Link>

        <nav className="hidden items-center space-x-5 md:flex lg:space-x-7">
          {navLinks.map((link) =>
            renderLink(
              link,
              "link-hover min-h-11 inline-flex items-center text-sm font-medium",
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
            {navLinks.map((link) =>
              renderLink(
                link,
                "min-h-11 py-3 text-lg font-medium flex items-center",
                () => setIsMobileMenuOpen(false),
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
