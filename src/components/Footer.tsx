import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "@/lib/nav";
import { socialLink } from "@/lib/social";

const LINKS = [
  { href: "/learn", label: "Knowledge" },
  { href: "/tools", label: "Tools" },
  { href: "/advisory", label: "Advisory" },
];

const CONNECT = [
  { network: "linkedin", label: "LinkedIn" },
  { network: "github", label: "GitHub" },
  { network: "telegram", label: "Telegram" },
  { network: "email", label: "Email" },
] as const;

const LINK = "hover:text-foreground transition-colors";

/**
 * The bottom of the tile. Deliberately small: the sidebar already carries the
 * site map, so this is the signature line and the ways out, nothing more.
 */
const Footer = () => (
  <footer className="border-border text-muted-foreground mt-auto border-t">
    <div className="container mx-auto flex flex-col gap-3 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="text-foreground font-medium">{SITE.name}</span>
        <span className="mx-1.5 opacity-40">·</span>
        {SITE.chip}
        <span className="mx-1.5 opacity-40">·</span>
        London
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
        {CONNECT.map(({ network, label }) => (
          <li key={network}>
            <a
              href={socialLink(network)}
              {...(network === "email" ? {} : { target: "_blank", rel: "noreferrer" })}
              className={LINK}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
