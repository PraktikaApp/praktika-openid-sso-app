'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(8, { message: 'Email must be at least 8 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  if (!baseUrl) {
    return <p>Error: API base URL is missing.</p>;
  }

  const client_id = searchParams.get('client_id') || '';
  const redirect_uri = searchParams.get('redirect_uri') || '';
  const scope = searchParams.get('scope') || '';
  const response_type = searchParams.get('response_type') || '';
  const state = searchParams.get('state') || '';
  const nonce = searchParams.get('nonce') || '';

  const oauthUrl = `${baseUrl}/api/v1/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&response_type=${response_type}&state=${state}&nonce=${nonce}`;

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    startTransition(() => {
      const formData = new URLSearchParams();
      formData.append('email', data.email);
      formData.append('password', data.password);

      axios
        .post(oauthUrl, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {
          const uri = response.data.data.uri;
          if (uri) {
            const newWindow = window.open(uri, '_blank');
            newWindow?.focus() ||
              alert('Popup blocked! Please allow popups for this page.');
          } else {
            alert('No URI found in the response.');
          }
        })
        .catch((error) => {
          alert(
            `An error occurred. Please try again later. ${error instanceof Error ? error.message : error}`,
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Enter your email...'
                  disabled={loading || isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='********'
                  disabled={loading || isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loading || isPending}
          className='ml-auto w-full'
          type='submit'
        >
          {loading || isPending ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
