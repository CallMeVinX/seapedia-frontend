import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
              SEAPEDIA
            </Link>
            <p className="text-slate-500 text-sm leading-6 max-w-xs">
              The premium multi-vendor marketplace connecting buyers, sellers, and drivers in one seamless ecosystem.
            </p>
            <div className="flex space-x-6">
              {/* Social icons placeholders */}
              <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Marketplace</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">All Categories</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Featured Stores</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Trending Products</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Vouchers</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Help Center</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Track Order</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Return Policy</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Partners</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Sell on SEAPEDIA</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Driver Portal</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Affiliate Program</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Terms of Service</Link></li>
                  <li><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-400 xl:text-center">
            &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
