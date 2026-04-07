import Link from 'next/link';
import { DriverRegistrationForm } from '@/components/driver-registration-form';
import { Icons } from '@/components/icons';

export default function DriverRegistrationPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary p-4 md:py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Icons.TotoLogo className="h-8 w-auto text-primary" />
          </Link>
        </div>
        <DriverRegistrationForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already a driver?{' '}
          <Link
            href="/driver/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
