import React, { Suspense, lazy } from "react";
import Intro from "@/components/Intro";
import Experience from "@/components/Experience";
import DomainProof from "@/components/DomainProof";
import Teaching from "@/components/Teaching";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

const Talks = lazy(() => import("@/components/Talks"));

/**
 * The overview. One page with anchors rather than five routes: the sidebar
 * tracks which section is in view, and every inbound `/#experience` link
 * written in the last few years keeps working.
 */
const Index = () => (
  <>
    <Intro />
    <Experience />
    <DomainProof />
    <Teaching />
    <Suspense
      fallback={
        <div className="text-muted-foreground py-16 text-center text-sm">Loading talks…</div>
      }
    >
      <Talks />
    </Suspense>
    {/* Also on /advisory. Here so the people vouching are one scroll from the
        record they vouch for, not behind a page about engagements. */}
    <Testimonials />
    <Contact />
  </>
);

export default Index;
