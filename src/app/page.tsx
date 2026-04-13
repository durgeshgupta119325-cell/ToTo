import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/support">Support</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && (
                <div className="relative mx-auto w-full max-w-xl lg:order-last">
                  <Image
                    alt="Hero"
                    src={heroImage.imageUrl}
                    width={600}
                    height={600}
                    className="aspect-square w-full overflow-hidden rounded-xl object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                </div>
              )}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your City, Your Ride
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TOTO connects you with reliable e-rickshaw and cab drivers
                    in your city. Quick, simple, and affordable.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/book-ride">
                      Book a Ride
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/driver/register">Become a Driver</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
