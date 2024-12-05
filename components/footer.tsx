import React from "react";

const dynamicCopyright = () => {
  return `${new Date().getFullYear()} Fish Tournament`;
};

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
      <p>&copy; {dynamicCopyright()}</p>
    </footer>
  );
}
