import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Intro from '@/components/Intro.tsx';
import Services from '@/components/Services';
import Experience from '@/components/Experience';
import Testimonials from '@/components/Testimonials';
import Talks from '@/components/Talks';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Implement reveal-on-scroll functionality
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Intro />
        <Services />
        <Experience />
        <Testimonials />
        <Talks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
