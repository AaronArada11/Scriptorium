import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from "./ui/button";
import { FileText, Menu } from "lucide-react";
import { SignInButton, UserButton } from '@clerk/nextjs'
import { DarkModeToggle } from "../components/DarkModeToggle";
interface NavbarProps {
  transparent?: boolean;
}


export function Navbar({ transparent = false }: NavbarProps) {
  const router = useRouter()

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/marketing')
    sessionStorage.setItem('scrollToFeatures', 'true')
  }
  return (
    <nav className={`border-b ${transparent ? 'bg-transparent border-transparent' : 'bg-card border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="size-8 text-[#507dbc]" />
            <span className="text-xl font-bold">Scriptorium</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">

            <a 
              href="/marketing#FeatureSec" 
              onClick={handleFeaturesClick}
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </a>

            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <DarkModeToggle />
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