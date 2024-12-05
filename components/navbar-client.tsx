"use client";

import Link from "next/link";
import MenuIcon from "@/components/menu-icon";
import CloseIcon from "@/components/close-icon";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "@/components/signup-dialog";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/actions";

export default function NavbarClient({ user }: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    console.log("Zmiana!", isMobileMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="z-10 flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={"/"}>Fish Tournament App</Link>
        </div>
        <div className="hidden lg:flex lg:gap-8 [&>a]:transition-colors hover:[&>a]:text-white/50">
          <Link href={"/"}>O nas</Link>
          <Link href={"/"}>Zawody</Link>
          <Link href={"/"}>Blog</Link>
          <Link href={"/"}>Kontakt</Link>
        </div>
        {user ? (
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            Hej, {user.email}!
            <form action={signOutAction}>
              <Button type="submit" variant={"outline"}>
                Wyloguj się
              </Button>
            </form>
          </div>
        ) : (
          <div className="hidden lg:flex lg:gap-2">
            <Button asChild size="sm" variant={"outline"}>
              <Link href="/sign-in">Zaloguj się</Link>
            </Button>
            <SignUpDialog />
          </div>
        )}

        <button className="lg:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Mobile menu */}
        <div
          className={`${isMobileMenuOpen ? "flex" : "hidden"} fixed inset-0 -z-10 bg-background`}
        >
          <div className="mt-28 flex w-screen flex-col items-center space-y-8 text-center">
            <div
              className="flex flex-col space-y-4 text-lg font-medium tracking-wide [&>a]:w-screen"
              onClick={handleCloseMenu}
            >
              <Link href={"/"}>O nas</Link>
              <Link href={"/"}>Zawody</Link>
              <Link href={"/"}>Blog</Link>
              <Link href={"/"}>Kontakt</Link>
            </div>

            <div className="" onClick={handleCloseMenu}>
              {user ? (
                <div className="flex items-center gap-2">
                  Hej, {user.email}!
                  <form action={signOutAction}>
                    <Button type="submit" variant={"outline"}>
                      Wyloguj się
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant={"outline"}>
                    <Link href="/sign-in">Zaloguj się</Link>
                  </Button>
                  <SignUpDialog />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
