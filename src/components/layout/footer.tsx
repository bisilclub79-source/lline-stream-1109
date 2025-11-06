import Link from 'next/link';
import Logo from '@/components/logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              © {currentYear} CineStream, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/policy/terms-of-service" className="text-muted-foreground transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/policy/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/policy/refund-policy" className="text-muted-foreground transition-colors hover:text-foreground">
              Refund Policy
            </Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
