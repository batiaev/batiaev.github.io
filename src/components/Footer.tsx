import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import data from "@/data/data.json";
import { socialLink } from "@/lib/social";

/** In-site destinations. Hash targets are sections of the home page. */
const LINKS = [
  { href: "/#experience", label: "Experience" },
  { href: "/learn", label: "Knowledge base" },
  { href: "/tools", label: "Calculators" },
  { href: "/advisory", label: "Advisory" },
  { href: "/#contact", label: "Contact" },
];

const CONNECT = [
  { network: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { network: "github", label: "GitHub", Icon: Github },
  { network: "email", label: "Email", Icon: Mail },
  { network: "telegram", label: "Telegram", Icon: MessageCircle },
] as const;

const ROW = "text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm transition-colors sm:text-base";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 border-t bg-accent/30 py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-start gap-4">
              <img
                src={data.avatar}
                alt={data.name}
                width={72}
                height={72}
                loading="lazy"
                decoding="async"
                className="border-border/60 h-16 w-16 shrink-0 rounded-full border object-cover shadow-subtle ring-2 ring-background ring-offset-2 ring-offset-border/40 sm:h-[72px] sm:w-[72px]"
              />
              <div>
                <h3 className="font-display mb-2 text-xl font-semibold sm:text-2xl">
                  {data.name}
                </h3>
                <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
                  {data.description}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium sm:mb-4">Links</h4>
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/#") ? (
                    <a href={link.href} className={ROW}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className={ROW}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium sm:mb-4">Connect</h4>
            <ul>
              {CONNECT.map(({ network, label, Icon }) => (
                <li key={network}>
                  <a
                    href={socialLink(network)}
                    {...(network === "email"
                      ? {}
                      : { target: "_blank", rel: "noreferrer" })}
                    className={ROW}
                  >
                    <Icon className="mr-2 h-5 w-5" aria-hidden /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border/40 mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row sm:gap-4 sm:pt-8">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {data.name}
          </p>
          <p className="text-muted-foreground text-center text-xs sm:text-sm">
            {data.chip} · London
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
