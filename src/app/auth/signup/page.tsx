
import AuthForm from '@/components/auth/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StickittyLogo from '@/components/common/stickitty-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-card">
      <Card className="w-full max-w-md bg-card shadow-2xl animate-fade-in">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4" aria-label="Stickitty.inc Home">
            <StickittyLogo className="h-16 w-auto mx-auto text-primary" />
          </Link>
          <CardTitle className="font-headline text-4xl text-primary tracking-wider">Join Stickitty.inc</CardTitle>
          <CardDescription className="text-foreground/80">
            Create an account to start generating and collecting awesome stickers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <p className="mt-6 text-center text-sm text-foreground/70">
            Already have an account?{' '}
            <Button variant="link" asChild className="text-primary hover:text-accent p-0">
              <Link href="/auth/login">Log in</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
