import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertTriangle, ChevronDown } from 'lucide-react';
import FilterSidebar from '../Hosteller/compo/FilterSidebar';
import HostelCard from '../Hosteller/compo/HostelCard';
import { getAllHostels } from '../../apis/hostellerApis';
import Loader from './UI/Loader';
import HostelSkeleton from './UI/HostelSkeleton';

const initialFilters = {
  messType: '',
  minPrice: '',
  maxPrice: '',
  roomCategories: '',
  genderType: '',
  sortBy: 'price',
  sortOrder: 'asc',
};

const BrowseHostels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 🔹 track last query (to avoid refetch if nothing actually changed)
  const lastQueryRef = useRef('');

  const hasSearch = searchTerm.trim() !== '';

  const filterKeys = ['messType', 'minPrice', 'maxPrice', 'roomCategories', 'genderType'];

  const hasFilters = filterKeys.some((key) => {
    const v = filters[key];
    return v !== '' && v !== null && v !== undefined;
  });

  const activeFilterCount = filterKeys.reduce((count, key) => {
    const v = filters[key];
    return v !== '' && v !== null && v !== undefined ? count + 1 : count;
  }, 0);

  const showSkeleton = fetching && hostels.length > 0;
  const showMainLoader = loading && hostels.length === 0;

  useEffect(() => {
    let timer;

    const fetchHostelsData = async () => {
      try {
        const hasAnyFilterOrSearch = hasSearch || hasFilters;

        const params = hasAnyFilterOrSearch
          ? {
              ...(hasSearch && { search: searchTerm.trim() }),
              ...filters,
            }
          : {};

        // 🔹 build stable query signature to compare
        const querySignature = JSON.stringify(params);

        // if nothing actually changed, do nothing (prevents extra refetch on Clear)
        if (querySignature === lastQueryRef.current) {
          return;
        }
        lastQueryRef.current = querySignature;

        if (!hasAnyFilterOrSearch && hostels.length === 0) {
          setLoading(true);
        } else {
          setFetching(true);
        }
        setError(null);

        const data = await getAllHostels(params);
        setHostels(data.hostels || []);
      } catch (err) {
        setError(err.message || 'Failed to load hostels');
        setHostels([]);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };

    timer = setTimeout(fetchHostelsData, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters]);

    // Lock body scroll when modal is open (Mobile only)
  useEffect(() => {
    const handleScrollLock = () => {
      const isSmallScreen = window.innerWidth < 1024; // changed to lg (1024px) or keep 768px depending on your "mobile" definition
      
      if (showMobileFilters && isSmallScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleScrollLock(); // Run immediately on state change
    
    // Optional: Update on resize if user rotates device
    window.addEventListener('resize', handleScrollLock);

    return () => {
      document.body.style.overflow = ''; // Cleanup always unlocks
      window.removeEventListener('resize', handleScrollLock);
    };
  }, [showMobileFilters]);


  const handleFilterChange = (partial) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const clearAll = () => {
    setSearchTerm('');
    setFilters(initialFilters);
  };

  if (showMainLoader) {
    return (
      <Loader
        size="lg"
        text="Loading Hostels ..."
        className="py-20"
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Find Your Perfect Hostel
          </h1>

          
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-shadow shadow-sm"
            placeholder="Search by hostel name, city, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="inline-flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm transition-all"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-xs font-semibold text-orange-700 dark:text-orange-400 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div
          className="lg:hidden h-screen fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute left-0 top-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-stone-900 shadow-2xl border-r border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              <FilterSidebar filters={filters} onChange={handleFilterChange} />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-center gap-3 mb-8">
          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
          <span className="text-orange-900 dark:text-orange-100 font-medium">
            {error}
          </span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-6">
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </aside>

        {/* Results Grid */}
        <section className="col-span-1 lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {showSkeleton ? 'Loading...' : `Showing ${hostels.length} Hostels`}
            </h2>

            <div className="relative w-full sm:w-auto">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange({ sortBy, sortOrder });
                }}
                className="w-full sm:w-auto bg-white dark:bg-stone-900 text-sm font-medium text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none cursor-pointer hover:border-orange-300 transition-all shadow-sm appearance-none"
              >
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {showSkeleton ? (
            <HostelSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hostels.map((hostel) => (
                  <HostelCard
                    key={hostel.id}
                    hostel={{
                      id: hostel.id,
                      name: hostel.name,
                      area: hostel.area,
                      city: hostel.city,
                      messType: hostel.messType,
                      topAmenities: hostel.topAmenities || [],
                      coverImage: hostel.coverImage,
                      ownerName: hostel.ownerName,
                      totalRooms: hostel.totalRooms,
                      activeResidents: hostel.activeResidents,
                      minPrice: hostel.minPrice,
                    }}
                  />
                ))}
              </div>

              {hostels.length === 0 && !fetching && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    No hostels found
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                    Try changing your search or filters to see more options.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default BrowseHostels;
