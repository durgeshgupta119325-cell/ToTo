
'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowLeft, Mail } from 'lucide-react';
import { SUPPORT_FAQS } from '@/lib/mock-data';

export default function SupportPage() {
  const supportEmail = 'durgeshgupta119325@gmail.com';

  const handleFaqClick = (question: string) => {
    const subject = encodeURIComponent(`Question from Help Center: ${question}`);
    const body = encodeURIComponent(`I need help with: ${question}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl py-12 px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question? We're here to help you get moving.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {SUPPORT_FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-none mb-4 bg-muted/30 rounded-lg px-4">
                  <AccordionTrigger className="text-lg hover:no-underline text-left py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-6">
                    <div className="space-y-4">
                      <p>{faq.answer}</p>
                      <Button 
                        onClick={() => handleFaqClick(faq.question)}
                        variant="outline" 
                        size="sm"
                        className="group"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Ask about this question
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-16 rounded-2xl bg-primary/5 p-8 text-center border border-primary/10">
            <h2 className="text-2xl font-bold">Still need help?</h2>
            <p className="mt-2 text-muted-foreground">
              Our support team is available to assist you with any other inquiries.
            </p>
            <Button asChild className="mt-6 h-12 px-8 text-lg font-bold" size="lg">
              <a href={`mailto:${supportEmail}`}>
                Contact Support
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Direct email: <span className="font-semibold text-foreground">{supportEmail}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
