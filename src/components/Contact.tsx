import React, { useEffect, useRef } from "react";
import { revealOnScroll } from "@/lib/reveal";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { socialLink } from "@/lib/social";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => revealOnScroll([sectionRef.current]), []);

  return (
    <section id="contact" className="py-16 sm:py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="highlight-chip">Contact</div>
          <h2 className="section-title">Get in touch</h2>
          <p className="section-subtitle mx-auto">
            Direct channels for product, leadership, or expert conversations.
            Advisory bookings live on the{" "}
            <Link to="/advisory" className="text-primary hover:underline">
              advisory page
            </Link>
            ; code lives on{" "}
            <a
              href={socialLink("github")}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button size="lg" className="min-h-11 font-medium" asChild>
            <a href={socialLink("email")}>
              <Mail className="mr-2 h-5 w-5" aria-hidden />
              Email
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-11 font-medium"
            asChild
          >
            <a
              href={socialLink("linkedin")}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="mr-2 h-5 w-5" aria-hidden />
              LinkedIn
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-11 font-medium"
            asChild
          >
            <a
              href={socialLink("telegram")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
              Telegram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
