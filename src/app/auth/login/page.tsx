
import AuthForm from '@/components/auth/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StickittyLogo from '@/components/common/stickitty-logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-card">
      <Card className="w-full max-w-md bg-card shadow-2xl animate-fade-in">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4" aria-label="Stickitty.inc Home">
            <StickittyLogo className="h-16 w-auto mx-auto text-primary" />
          </Link>
          <CardTitle className="font-headline text-4xl text-primary tracking-wider">Welcome Back!</CardTitle>
          <CardDescription className="text-foreground/80">
            Log in to continue your Stickitty journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm text-foreground/70">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="text-primary hover:text-accent p-0">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
