import React from 'react';
import { Linkedin, Mail, Github, MessageCircle, Calendar } from 'lucide-react';
import data from "../data/data.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-12 bg-accent/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-display font-semibold mb-4">{data.name}</h3>
            <p className="text-muted-foreground max-w-md">
              {data.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
              </li>
              <li>
                <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">Experience</a>
              </li>
              <li>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={data.social[0].link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={data.social[6].link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" /> Email
                </a>
              </li>
              <li>
                <a
                  href={data.social[2].link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> Telegram
                </a>
              </li>
              <li>
                <a
                  href={data.social[5].link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="h-5 w-5 mr-2" /> Calendar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {data.name}. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
