
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, CheckSquare } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === 'login';
  const schema = isLogin ? loginSchema : signupSchema;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isLogin 
      ? { email: '', password: '' } 
      : { username: '', email: '', password: '', confirmPassword: '', agreeToTerms: false },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log('Form values:', values);
    // Placeholder for actual Firebase Auth logic
    toast({
        title: `${isLogin ? 'Login' : 'Signup'} Successful!`,
        description: `Welcome! You've been successfully ${isLogin ? 'logged in' : 'signed up'}.`,
    });
    form.reset();
  };

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isLogin && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-foreground/80"><User className="mr-2 h-4 w-4 text-primary" /> Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" {...field} className="bg-background text-base py-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-foreground/80"><Mail className="mr-2 h-4 w-4 text-primary" /> Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} className="bg-background text-base py-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-foreground/80"><Lock className="mr-2 h-4 w-4 text-primary" /> Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="bg-background text-base py-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-foreground/80"><Lock className="mr-2 h-4 w-4 text-primary" /> Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="bg-background text-base py-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isLogin && (
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-background">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="agreeToTerms"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="agreeToTerms" className="text-sm font-medium text-foreground/80 cursor-pointer">
                    I agree to the <Button variant="link" type="button" className="p-0 h-auto text-primary hover:text-accent">Terms & Conditions</Button>
                  </FormLabel>
                   <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold text-lg py-3">
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
      </form>
      <Separator className="my-6 bg-border/50" />
      <Button variant="outline" className="w-full text-foreground/90 hover:bg-muted/50 border-border font-medium text-base py-3" onClick={() => console.log('Google login clicked')}>
        <GoogleIcon />
        <span className="ml-2">{isLogin ? 'Log in' : 'Sign up'} with Google</span>
      </Button>
    </Form>
  );
}
