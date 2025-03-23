import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
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
            <div className="highlight-chip">Start Your Journey</div>
            <h2 className="section-title">Ready to Achieve Your Goals?</h2>
            <p className="section-subtitle mx-auto">
              Book a free strategy call to discuss how I can help you to achieve your goals with strategic advice, technical consultation, or CTO mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-transparent shadow-subtle">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Start Options</CardTitle>
                <CardDescription>
                  Choose the most convenient way to start working together.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Book a Free Strategy Call</p>
                    <p className="text-sm text-muted-foreground">30-minute consultation to discuss your needs</p>
                    <a href={data.social[5].link} className="text-primary link-hover inline-flex items-center gap-1 mt-1">
                      Schedule Now <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-full">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Connect on LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Follow for daily insights and updates</p>
                    <a
                        href={data.social[0].link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary link-hover inline-flex items-center gap-1 mt-1"
                    >
                      Connect Now <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Chat on Telegram</p>
                    <p className="text-sm text-muted-foreground">Quick questions and updates</p>
                    <a
                        href={data.social[2].link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary link-hover inline-flex items-center gap-1 mt-1"
                    >
                      Start Chat <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-transparent shadow-subtle">
              <CardHeader>
                <CardTitle className="text-2xl">Tell Me About Your Project</CardTitle>
                <CardDescription>
                  Share your challenges and goals, and I'll create a tailored solution for you.
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
                        placeholder="What challenges are you facing? What goals do you want to achieve?"
                        className="bg-accent/50 border-transparent focus-visible:bg-background transition-all min-h-[120px]"
                        required
                    />
                  </div>
                    <Button type="submit" className="w-full mt-2" asChild>
                      <a href={data.social[0].link} target="_blank" rel="noreferrer">
                        Send Message
                      </a>
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
