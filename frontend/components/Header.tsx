"use client";
import React, { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Search Buses', href: '/search' },
    { name: 'My Bookings', href: '/bookings' },
    { name: 'Admin Panel', href: '/admin' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-bus-primary">BusBooking</span>
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                      isActive(item.href)
                        ? "border-bus-primary text-bus-primary"
                        : "border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
          
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bus-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.href)
                    ? "bg-bus-primary/10 text-bus-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col space-y-2">
              <Link
                href="/login"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center px-3 py-2 text-base font-medium bg-bus-primary text-white rounded-md"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5 mr-2" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;