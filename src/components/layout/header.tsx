'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/logo';
import { ChevronDown, LayoutDashboard, LogOut, User, Menu, Database } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { seedDatabase } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/category/all', label: 'Categories' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const handleSeed = async () => {
    if (!firestore) return;
    toast({
        title: 'Seeding Database...',
        description: 'Please wait while we populate the database with sample data.',
    });
    const result = await seedDatabase(firestore);
    if (result.success) {
        toast({
            title: 'Success!',
            description: 'The database has been seeded with sample data.',
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Seeding Database',
            description: 'There was an error. Check the console for details.',
        });
    }
  }

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full h-10 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user?.displayName}</span>
          <ChevronDown className="h-4 w-4 hidden md:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {user?.isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-2">
       {process.env.NODE_ENV === 'development' && (
         <Button variant="outline" size="sm" onClick={handleSeed}>
            <Database className="mr-2 h-4 w-4" />
            Seed Database
        </Button>
      )}
      <Button variant="outline" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const MobileNav = () => (
     <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
           <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium pt-10">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
              <Logo />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="mr-2">
            <Logo />
          </Link>
          <DesktopNav />
        </div>

        <div className="flex items-center gap-4">
          {!loading && (user ? <UserMenu /> : <AuthButtons />)}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
