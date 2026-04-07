import Link from 'next/link';
import { DriverLoginForm } from '@/components/driver-login-form';
import { Icons } from '@/components/icons';

export default function DriverLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Icons.TotoLogo className="h-8 w-auto text-primary" />
          </Link>
        </div>
        <DriverLoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New driver?{' '}
          <Link
            href="/driver/register"
            className="font-medium text-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
