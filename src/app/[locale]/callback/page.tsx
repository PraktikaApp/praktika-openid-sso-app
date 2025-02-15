'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

import { ENV } from '@/lib/env';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const hasParams = searchParams.toString();

  useEffect(() => {
    if (!hasParams) {
      router.push('/');
    }
  }, [hasParams, router]);

  useEffect(() => {
    const fetchToken = async () => {
      if (code) {
        try {
          const response = await axios.post(`${ENV.BASE_URI}/openid/token`, {
            code,
          });
          const { data } = response.data;
          Cookies.set('auth_token', data.token, { expires: 1 });
          redirect('/dashboard/overview');
        } catch (error) {
          alert('Error fetching token');
        }
      }
    };
    if (code) fetchToken();
  }, [code]);

  return <></>;
}
