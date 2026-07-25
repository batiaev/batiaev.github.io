import React, { useEffect, Suspense, lazy } from "react";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import CapabilityMix from "@/components/CapabilityMix";
import Initiatives from "@/components/Initiatives";
import Experience from "@/components/Experience";
import Engagement from "@/components/Engagement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Talks = lazy(() => import("@/components/Talks"));

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    }

    return () => {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main>
        <Intro />
        <CapabilityMix />
        <Initiatives />
        <Experience />
        <Engagement />
        <Suspense
          fallback={
            <div className="text-muted-foreground py-16 text-center text-sm">
              Loading talks…
            </div>
          }
        >
          <Talks />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
