import React, { useEffect, useRef } from "react";
import { ArrowUpRight, Calendar, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { revealOnScroll } from "@/lib/reveal";
import { socialLink } from "@/lib/social";
import Engagement from "@/components/Engagement";
import data from "@/data/data.json";

const CHANNELS = [
  { network: "email", label: "Email", Icon: Mail },
  { network: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { network: "telegram", label: "Telegram", Icon: MessageCircle },
  { network: "github", label: "GitHub", Icon: Github },
  { network: "calendar", label: "Book 30 minutes", Icon: Calendar },
] as const;

const handleFor = (network: string) =>
  data.social.find((s) => s.name === network)?.id ?? "";

/**
 * Contact as a key–value list — channel on the left, handle on the right — the
 * way the dealing tool lays out a record. The handle is the useful part: it is
 * what someone copies.
 */
const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => revealOnScroll([sectionRef.current]), []);

  return (
    <section id="contact" className="border-border scroll-mt-14 border-t" ref={sectionRef}>
      <div className="container mx-auto py-12 sm:py-16">
        <div className="highlight-chip">Contact</div>
        <h2 className="section-title">Get in touch</h2>
        <p className="section-subtitle">
          Direct channels for product, leadership, or expert conversations.
        </p>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border">
            {CHANNELS.map(({ network, label, Icon }) => (
              <li key={network}>
                <a
                  href={socialLink(network)}
                  {...(network === "email" ? {} : { target: "_blank", rel: "noreferrer" })}
                  className="hover:bg-accent/40 group flex min-h-12 items-center gap-3 px-4 transition-colors sm:px-5"
                >
                  <Icon className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" aria-hidden />
                  <span className="w-32 shrink-0 text-[14px] font-medium sm:w-40">{label}</span>
                  <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-[12.5px]">
                    {handleFor(network)}
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground/50 group-hover:text-foreground size-4 shrink-0 transition-colors"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>

          <Engagement />
        </div>
      </div>
    </section>
  );
};

export default Contact;
