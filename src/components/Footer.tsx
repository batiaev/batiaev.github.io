import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import data from "@/data/data.json";
import { socialLink } from "@/lib/social";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 border-t bg-accent/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-display mb-4 text-xl font-semibold sm:text-2xl">
              {data.name}
            </h3>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
              {data.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#building"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  Building
                </a>
              </li>
              <li>
                <a
                  href="/#experience"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  Experience
                </a>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  Calculators
                </Link>
              </li>
              <li>
                <Link
                  to="/advisory"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  Advisory
                </Link>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Connect</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href={socialLink("linkedin")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  <Linkedin className="mr-2 h-5 w-5" aria-hidden /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={socialLink("github")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  <Github className="mr-2 h-5 w-5" aria-hidden /> GitHub
                </a>
              </li>
              <li>
                <a
                  href={socialLink("email")}
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  <Mail className="mr-2 h-5 w-5" aria-hidden /> Email
                </a>
              </li>
              <li>
                <a
                  href={socialLink("telegram")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center transition-colors"
                >
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden />{" "}
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/40 mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
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
