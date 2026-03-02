import { Link } from 'next/link'
import { Button } from "./ui/button";
import { FileText, Menu } from "lucide-react";


interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  return (
    <nav className={`border-b ${transparent ? 'bg-transparent border-transparent' : 'bg-card border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="size-8 text-primary" />
            <span className="text-xl font-bold">Scriptorium</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Button size="sm">Get Started</Button>
          </div>

          <button className="md:hidden">
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}