
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import { SUPPORT_FAQS } from '@/lib/mock-data';

export default function SupportPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl py-12 md:py-24">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Help Center
            </h1>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {SUPPORT_FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold">Still need help?</h2>
            <p className="mt-2 text-muted-foreground">
              Contact us at{' '}
              <a
                href="mailto:support@totoapp.com"
                className="font-medium text-primary hover:underline"
              >
                support@totoapp.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
