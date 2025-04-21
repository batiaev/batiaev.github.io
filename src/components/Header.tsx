import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import data from "../data/data.json";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar transition-all duration-300 ${isScrolled ? 'py-3 shadow-subtle' : 'py-5'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <a href="#" className="text-2xl font-display font-semibold">
          {data.name}
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-sm font-medium link-hover">Services</a>
          <a href="#case-studies" className="text-sm font-medium link-hover">Case Studies</a>
          <a href="#testimonials" className="text-sm font-medium link-hover">Testimonials</a>
          <a href="#talks" className="text-sm font-medium link-hover">Talks</a>
          <a href="#contact" className="text-sm font-medium link-hover">Contact</a>
          <a href={data.social[5].link} target="_blank" rel="noreferrer">
            <Button className="ml-4">Book a Call</Button>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border/40 animate-fade-in z-50"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="container py-4 flex flex-col space-y-4">
            <a
              href="#services"
              className="text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#case-studies"
              className="text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Case Studies
            </a>
            <a
              href="#testimonials"
              className="text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Button className="mt-2 w-full">Book a Call</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
