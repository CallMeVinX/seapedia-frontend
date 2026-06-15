export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-seapedia-bg">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-500 sm:px-6">
        © {new Date().getFullYear()} SEAPEDIA Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
