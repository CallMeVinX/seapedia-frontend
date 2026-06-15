import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-18">
        <Link href="/" className="text-xl font-bold text-seapedia-navy">
          SEAPEDIA
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-1.5 text-sm font-medium text-seapedia-navy transition-colors hover:text-seapedia-navy-light"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Link>
      </div>
    </header>
  );
}
