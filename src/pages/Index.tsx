import React, { useEffect, Suspense, lazy } from "react";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import Initiatives from "@/components/Initiatives";
import Experience from "@/components/Experience";
import DomainProof from "@/components/DomainProof";
import Teaching from "@/components/Teaching";
import Engagement from "@/components/Engagement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Talks = lazy(() => import("@/components/Talks"));

const Index = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main>
        <Intro />
        <Experience />
        <DomainProof />
        {/*<Initiatives />*/}
        <Teaching />
        <Suspense
          fallback={
            <div className="text-muted-foreground py-16 text-center text-sm">
              Loading talks…
            </div>
          }
        >
          <Talks />
        </Suspense>
        <Engagement />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
