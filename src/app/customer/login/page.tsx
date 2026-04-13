"use client";

import Link from 'next/link';
import { CustomerLoginForm } from '@/components/customer-login-form';
import { Icons } from '@/components/icons';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('toto-customer')) {
      router.push('/customer/dashboard');
    }
  }, [router]);
  
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Icons.TotoLogo className="h-8 w-auto text-primary" />
          </Link>
        </div>
        <CustomerLoginForm />
      </div>
    </div>
  );
}
