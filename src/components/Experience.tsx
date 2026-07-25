import React, { useEffect, useRef } from "react";
import { CheckCheck, ArrowUpRight } from "lucide-react";
import data from "@/data/data.json";

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    if (sectionRef.current) {
      sectionRef.current.classList.add("reveal-on-scroll");
      observer.observe(sectionRef.current);
    }

    timelineItemsRef.current.forEach((item) => {
      if (item) {
        item.classList.add("reveal-on-scroll");
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="section py-16 sm:py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">Selected experience</div>
          <h2 className="section-title">From IC to CPTO</h2>
          <p className="section-subtitle mx-auto">
            Enterprise risk systems, hyperscale consumer fintech, and startup
            build — hands-on depth and executive scope in the same track record.
          </p>
        </div>

        <ol className="mx-auto max-w-3xl space-y-6">
          {data.experiences.map((item, index) => (
            <li
              key={item.id}
              className="rounded-lg border border-border/50 bg-background/80 p-5 sm:p-6"
              ref={(el) => {
                timelineItemsRef.current[index] = el;
              }}
            >
              <p className="text-muted-foreground text-sm font-medium">
                {item.period}
              </p>
              <h3 className="mt-1 text-lg font-semibold sm:text-xl">
                {item.title}
              </h3>
              <p className="text-primary mt-1 font-medium">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover inline-flex items-center gap-1"
                  >
                    {item.company}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : (
                  item.company
                )}
                <span className="text-muted-foreground font-normal">
                  {" "}
                  · {item.city}
                </span>
              </p>

              <ul className="mt-4 space-y-2">
                {item.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                    <CheckCheck
                      className="text-primary mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>

              {"proofLink" in item && item.proofLink ? (
                <a
                  href={item.proofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-4 inline-flex min-h-11 items-center text-sm hover:underline"
                >
                  Related public note
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
