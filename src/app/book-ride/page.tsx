import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';

export default function BookRidePage() {
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
        <div className="container flex flex-col items-center justify-center gap-6 py-12 md:py-24">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Book Your Ride
          </h1>
          <p className="max-w-md text-center text-muted-foreground">
            Our ride booking feature is coming soon! Stay tuned.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
