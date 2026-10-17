import React from "react";
import { Linkedin } from "lucide-react";
import data from "@/data/data.json";

/**
 * Two quotes do not need a carousel. Side by side, both are read; behind an
 * arrow, the second one mostly is not.
 */
const Testimonials = () => (
  <section id="testimonials" className="border-border scroll-mt-14 border-t">
    <div className="container mx-auto py-10 sm:py-12">
      <div className="highlight-chip">Peer perspective</div>
      <h2 className="section-title">What others say</h2>
      <p className="section-subtitle">
        Notes from executives and technical leaders I have worked alongside.
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.testimonials.map((testimonial) => (
          <li key={testimonial.author}>
            <figure className="surface flex h-full flex-col p-5 sm:p-6">
              <blockquote className="text-foreground/85 flex-1 text-[15px] leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="border-border mt-5 flex items-center justify-between gap-3 border-t pt-4">
                <span className="min-w-0">
                  <cite className="block text-[13px] font-medium not-italic">{testimonial.author}</cite>
                  <span className="text-muted-foreground block text-xs">{testimonial.title}</span>
                </span>
                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground grid size-8 shrink-0 place-items-center rounded-md transition-colors"
                  aria-label={`${testimonial.author} on LinkedIn`}
                >
                  <Linkedin className="size-4" aria-hidden />
                </a>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Testimonials;
