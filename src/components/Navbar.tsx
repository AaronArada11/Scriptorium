import Link from 'next/link'
import { Button } from "./ui/button";
import { FileText, Menu } from "lucide-react";
import { SignInButton, UserButton } from '@clerk/nextjs'

interface NavbarProps {
  transparent?: boolean;
}


export function Navbar({ transparent = false }: NavbarProps) {
  return (
    <nav className={`sticky top-0 z-50 border-b ${transparent ? 'bg-transparent border-transparent' : 'bg-card border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="size-8 text-[#507dbc]" />
            <span className="text-xl font-bold">Scriptorium</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">

            <Link href="/dashboard/workspaces#FeatureSec" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <Button size="sm" className='bg-[#507dbc] text-[#FFFFFF]'>Get Started</Button>
          </div>

          <button className="md:hidden">
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}