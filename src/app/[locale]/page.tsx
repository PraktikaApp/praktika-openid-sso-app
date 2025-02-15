'use client';
import { useEffect } from 'react';

// import { ENV } from '@/lib/env';
import { useRouter } from '@/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
    const scope = 'openid profile email';
    const response_type = 'code';
    const state = '189gdwq';
    const nonce = 'bsaf9t1';

    const authUrl = `/signin?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&response_type=${response_type}&state=${state}&nonce=${nonce}`;
    router.push(authUrl);
  }, [router]);

  return <></>;
}
