import FooterSection from "@/components/footer-section";
import Link from "next/link";
import React from "react";

const dynamicCopyright = () => {
  return `${new Date().getFullYear()} Fish Tournament`;
};

export default function Footer() {
  return (
    <footer className="w-full gap-8 border-t border-t-foreground/10 py-16 text-xs">
      <div className="mx-auto grid max-w-screen-sm grid-cols-1 justify-items-center gap-4 max-sm:gap-6 max-sm:text-center sm:grid-cols-3">
        <FooterSection title="Linki">
          <ul className="list-none p-0 hover:[&>li>a]:underline [&>li]:mt-3">
            <li>
              <Link href="/">O Nas</Link>
            </li>
            <li>
              <Link href="/">FAQ</Link>
            </li>
            <li>
              <Link href="/">Zawody</Link>
            </li>
            <li>
              <Link href="/">Kontakt</Link>
            </li>
            <li>
              <Link href="/">Konto</Link>
            </li>
            <li>
              <Link href="/">Blog</Link>
            </li>
          </ul>
        </FooterSection>

        <FooterSection title="Postanowienia prawne">
          <ul className="list-none p-0 hover:[&>li>a]:underline [&>li]:mt-3">
            <li>
              <Link href="/">Polityka prywatności</Link>
            </li>
            <li>
              <Link href="/">Regulamin</Link>
            </li>
          </ul>
        </FooterSection>

        <FooterSection title="Socialmedia">
          <ul className="list-none p-0 hover:[&>li>a]:underline [&>li]:mt-3">
            <li>
              <Link href="/">Twitter</Link>
            </li>
            <li>
              <Link href="/">Instagram</Link>
            </li>
            <li>
              <Link href="/">YouTube</Link>
            </li>
          </ul>
        </FooterSection>
        <p className="col-span-1 sm:col-span-3">&copy; {dynamicCopyright()}</p>
      </div>
    </footer>
  );
}
