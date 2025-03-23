import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin, Calendar, MessageCircle } from 'lucide-react';
import data from "../data/data.json";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.classList.add('reveal-on-scroll');
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally be connected to a form handling service
    console.log("Form submitted");
    // For demo purposes, we'll just reset the form
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <section id="contact" className="section bg-accent/30" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="highlight-chip">Get in Touch</div>
          <h2 className="section-title">Ready to Work Together?</h2>
          <p className="section-subtitle mx-auto">
            Whether you need strategic advice, technical consultation, or CTO mentorship,
            I'm here to help you achieve your fintech goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-transparent shadow-subtle">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>
                Reach out directly or schedule a consultation call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-accent p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href={data.social[6].link} className="text-primary link-hover">
                    {data.social[6].id}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-accent p-3 rounded-full">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <a
                    href={data.social[0].link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary link-hover"
                  >
                    {data.social[0].id}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-accent p-3 rounded-full">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Telegram</p>
                  <a
                    href={data.social[2].link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary link-hover"
                  >
                    {data.social[2].id}
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full" asChild>
                  <a href={data.social[5].link} target="_blank" rel="noreferrer">
                    Schedule a Call <Calendar className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-transparent shadow-subtle">
            <CardHeader>
              <CardTitle className="text-2xl">Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your name"
                    className="bg-accent/50 border-transparent focus-visible:bg-background transition-all"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-accent/50 border-transparent focus-visible:bg-background transition-all"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="How can I help you?"
                    className="bg-accent/50 border-transparent focus-visible:bg-background transition-all min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
