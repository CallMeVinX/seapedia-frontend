'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Store, ChevronRight, ChevronLeft, SlidersHorizontal, X } from 'lucide-react';

// --- MOCK PRODUCTS DATA ---
const ALL_MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Over-Ear Noise Cancelling Headphones',
    price: 299.00,
    store: 'TechHaven',
    category: 'Electronics',
    isVerified: true,
    image: '/tech_store.png',
  },
  {
    id: 'p2',
    name: 'Minimalist Smartwatch Series 5 - Aluminum',
    price: 199.99,
    store: 'TechHaven',
    category: 'Electronics',
    isVerified: true,
    image: '/luxe_living.png',
  },
  {
    id: 'p3',
    name: 'Classic Italian Leather Tote Bag - Caramel',
    price: 145.00,
    store: 'Boutique Minimal',
    category: 'Fashion & Apparel',
    isVerified: true,
    image: '/urban_wear.png',
  },
  {
    id: 'p4',
    name: 'Pro-Elite Lightweight Running Sneakers - Red',
    price: 120.00,
    store: 'Global Goods Direct',
    category: 'Fashion & Apparel',
    isVerified: true,
    image: '/kickz_kulture.png',
  },
  {
    id: 'p5',
    name: 'Executive Edition Smartwatch - Steel',
    price: 349.00,
    store: 'TechHaven',
    category: 'Electronics',
    isVerified: true,
    image: '/luxe_living.png',
  },
  {
    id: 'p6',
    name: 'Ultra-Slim 14" Pro Laptop - 16GB RAM',
    price: 1199.00,
    store: 'TechHaven',
    category: 'Electronics',
    isVerified: true,
    image: '/tech_store.png',
  },
  // Additional items for robust filtering/sorting/pagination
  {
    id: 'p7',
    name: 'Ergonomic Office Chair',
    price: 249.99,
    store: 'Luxe Living',
    category: 'Home & Garden',
    isVerified: false,
    image: '/luxe_living.png',
  },
  {
    id: 'p8',
    name: 'Water-Resistant Mountain Jacket',
    price: 89.99,
    store: 'Urban Wear',
    category: 'Sports & Outdoors',
    isVerified: false,
    image: '/urban_wear.png',
  },
  {
    id: 'p9',
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    store: 'TechHaven',
    category: 'Electronics',
    isVerified: true,
    image: '/tech_store.png',
  },
  {
    id: 'p10',
    name: 'Cozy Wool Blend Throw Blanket',
    price: 59.00,
    store: 'Boutique Minimal',
    category: 'Home & Garden',
    isVerified: true,
    image: '/luxe_living.png',
  },
];

const ITEMS_PER_PAGE = 6;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameters sync
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with search params changes (e.g. from navbar or trending clicks)
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const categoryVal = searchParams.get('category') || '';
    setSearchQuery(searchVal);
    if (categoryVal) {
      setSelectedCategories([categoryVal]);
    } else if (searchParams.has('category')) {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Categories and Stores list
  const categoriesList = ['Electronics', 'Fashion & Apparel', 'Home & Garden', 'Sports & Outdoors'];
  const storesList = ['TechHaven', 'Global Goods Direct', 'Boutique Minimal'];

  // Handle Category Toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  // Handle Store Toggle
  const handleStoreToggle = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
    setCurrentPage(1);
  };

  // Handle Price Range Application
  const handleApplyPriceRange = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice ? parseFloat(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? parseFloat(maxPrice) : null);
    setCurrentPage(1);
  };

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return ALL_MOCK_PRODUCTS.filter((product) => {
      // Search query matching
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.store.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Categories matching
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Store matching
      if (selectedStores.length > 0 && !selectedStores.includes(product.store)) {
        return false;
      }

      // Price matching
      if (appliedMinPrice !== null && product.price < appliedMinPrice) {
        return false;
      }
      if (appliedMaxPrice !== null && product.price > appliedMaxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      // default / recommended
      return 0;
    });
  }, [searchQuery, selectedCategories, selectedStores, appliedMinPrice, appliedMaxPrice, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="flex lg:hidden items-center justify-between mb-4">
          <Button
            variant="secondary"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <span className="text-sm text-slate-500">
            {totalItems} {totalItems === 1 ? 'result' : 'results'} found
          </span>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          
          {/* 1. Sidebar Filters (Desktop) */}
          <aside className="w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hidden lg:block sticky top-20">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Filters</h2>
            
            {/* Categories Section */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Categories</h3>
              <div className="space-y-3">
                {categoriesList.map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-950 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Price Range</h3>
              <form onSubmit={handleApplyPriceRange} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 inset-y-0 flex items-center text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <span className="text-slate-400 text-sm">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 inset-y-0 flex items-center text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" className="w-full text-xs font-semibold py-2">
                  Apply Range
                </Button>
              </form>
            </div>

            {/* Verified Stores Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Verified Stores</h3>
              <div className="space-y-3">
                {storesList.map((store) => (
                  <label key={store} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(store)}
                      onChange={() => handleStoreToggle(store)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-950 transition-colors">
                      {store}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* 2. Main Product Area */}
          <main className="flex-1">
            
            {/* Top Bar Info & Sort */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-600 hidden lg:inline">
                Showing {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of over {totalItems} results
              </span>
              
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-700 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <Card
                    key={product.id}
                    hoverable
                    className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden flex flex-col group h-full shadow-sm hover:shadow-lg transition-all"
                  >
                    {/* Image Area with Store Badge */}
                    <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Store Badge overlay */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                        <Store className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                          {product.store}
                        </span>
                      </div>
                    </div>

                    {/* Description Details */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] mb-2 hover:text-blue-700 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xl font-extrabold text-slate-900 mb-5">
                        ${product.price.toFixed(2)}
                      </p>
                      
                      <Button
                        variant="secondary"
                        className="w-full mt-auto text-xs py-2.5 font-bold tracking-wide uppercase border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <p className="text-slate-500 font-medium">No products match your current filters.</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedStores([]);
                    setMinPrice('');
                    setMaxPrice('');
                    setAppliedMinPrice(null);
                    setAppliedMaxPrice(null);
                    setSearchQuery('');
                  }}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 border rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'border-blue-900 bg-blue-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Filters Slide-over / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white py-4 pb-12 shadow-xl animate-slide-in">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-3">
                  {categoriesList.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-sm text-slate-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Price Range</h3>
                <form onSubmit={handleApplyPriceRange} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 inset-y-0 flex items-center text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <span className="text-slate-400 text-sm">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 inset-y-0 flex items-center text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="secondary" className="w-full text-xs font-semibold py-2">
                    Apply Range
                  </Button>
                </form>
              </div>

              {/* Verified Stores */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Verified Stores</h3>
                <div className="space-y-3">
                  {storesList.map((store) => (
                    <label key={store} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store)}
                        onChange={() => handleStoreToggle(store)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-sm text-slate-600">{store}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100">
              <Button variant="primary" onClick={() => setMobileFiltersOpen(false)} className="w-full">
                Show Results ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium text-sm">Loading products catalog...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
