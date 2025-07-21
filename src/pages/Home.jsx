import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllKelas, 
  searchKelas, 
  fetchKelasByCategory, 
  selectKelasData, 
  selectKelasLoading, 
  selectKelasError,
  clearError
} from '../store/redux/kelasSlice';

import { 
  setSearch, 
  setCategory, 
  setPriceRange, 
  setRating, 
  setSort, 
  resetFilter,
  selectAllFilters
} from '../store/redux/filterSlice';

import NavbarHome from '../components/organisems/NavbarHome';
import CardArticle from '../components/molecules/CardArticle';
import CardNewslt from '../components/molecules/CardNewslt';
import CardClass from '../components/molecules/CardClass';
import Filter from '../components/molecules/Filter';
import Footer from '../components/organisems/Footer';

const Home = () => {
  const dispatch = useDispatch();
  const coursesData = useSelector(selectKelasData);
  const loading = useSelector(selectKelasLoading);
  const error = useSelector(selectKelasError);
  
  const filter = useSelector(selectAllFilters) || {};
  
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const courses = useMemo(() => {
    try {
      if (Array.isArray(coursesData)) {
        return coursesData;
      }
      
      if (coursesData && typeof coursesData === 'object') {
        const possibleArrays = [
          coursesData.data,
          coursesData.courses,
          coursesData.kelas,
          coursesData.results,
          coursesData.items
        ];
        
        for (const arr of possibleArrays) {
          if (Array.isArray(arr)) {
            return arr;
          }
        }
        
        if (coursesData.length !== undefined) {
          return Array.from(coursesData);
        }
        
        return [coursesData];
      }
      
      return [];
    } catch (err) {
      console.error('Error normalizing courses data:', err);
      return [];
    }
  }, [coursesData]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchAllKelas());
  }, [dispatch]);

  const debouncedSearch = useMemo(() => {
    let timeoutId;
    return (term) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (term.trim()) {
          setIsSearching(true);
          dispatch(searchKelas(term));
          dispatch(setSearch(term));
        } else {
          setIsSearching(false);
          dispatch(fetchAllKelas());
          dispatch(setSearch(''));
        }
      }, 500);
    };
  }, [dispatch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [searchTerm, debouncedSearch]);

  const getFilteredCourses = useCallback((coursesArray, filterObj) => {
    if (!Array.isArray(coursesArray) || coursesArray.length === 0) return [];
    if (!filterObj) return coursesArray;

    let filtered = [...coursesArray];

    if (filterObj.category && filterObj.category.length > 0) {
      filtered = filtered.filter(course => {
        const courseCategory = course?.nama_kategori || course?.category || course?.kategori || '';
        return filterObj.category.includes(courseCategory);
      });
    }

    if (filterObj.priceRange) {
      const [min, max] = filterObj.priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filtered = filtered.filter(course => {
          let price = course?.harga || course?.price || 0;
          
          if (typeof price === 'string') {
            if (price.includes('K')) {
              price = parseInt(price.replace(/[^0-9]/g, '')) * 1000;
            } else {
              price = parseInt(price.replace(/[^0-9]/g, '')) || 0;
            }
          } else {
            price = parseInt(price) || 0;
          }
          
          if (max === 999999) {
            return price >= min;
          }
          return price >= min && price <= max;
        });
      }
    }

    if (filterObj.rating && filterObj.rating > 0) {
      const minRating = parseFloat(filterObj.rating);
      filtered = filtered.filter(course => {
        const rating = parseFloat(String(course?.rating || course?.nilai || 0).split(' ')[0]) || 0;
        return rating >= minRating;
      });
    }

    if (filterObj.duration) {
      filtered = filtered.filter(course => {
        const duration = parseInt(String(course?.durasi || course?.duration || 0).replace(/[^0-9]/g, '')) || 0;
        switch (filterObj.duration) {
          case '0-4': return duration < 4;
          case '4-8': return duration >= 4 && duration <= 8;
          case '8+': return duration > 8;
          default: return true;
        }
      });
    }

    // Sort
    if (filterObj.sort) {
      filtered.sort((a, b) => {
        const titleA = a?.judul || a?.title || a?.nama || '';
        const titleB = b?.judul || b?.title || b?.nama || '';
        
        switch (filterObj.sort) {
          case 'price-low':
            const priceA = parseInt(String(a?.harga || a?.price || 0).replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(String(b?.harga || b?.price || 0).replace(/[^0-9]/g, '')) || 0;
            return priceA - priceB;
          case 'price-high':
            const priceHighA = parseInt(String(a?.harga || a?.price || 0).replace(/[^0-9]/g, '')) || 0;
            const priceHighB = parseInt(String(b?.harga || b?.price || 0).replace(/[^0-9]/g, '')) || 0;
            return priceHighB - priceHighA;
          case 'rating':
            const ratingA = parseFloat(String(a?.rating || 0).split(' ')[0]) || 0;
            const ratingB = parseFloat(String(b?.rating || 0).split(' ')[0]) || 0;
            return ratingB - ratingA;
          case 'newest':
            return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
          case 'desc':
            return titleB.localeCompare(titleA);
          default: // 'asc'
            return titleA.localeCompare(titleB);
        }
      });
    }

    return filtered;
  }, []);

  const filteredCourses = useMemo(() => {
    return getFilteredCourses(courses, filter);
  }, [courses, filter, getFilteredCourses]);

  const handleFilterChange = useCallback((filterType, value) => {
    console.log('Filter changed:', filterType, value);
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchAllKelas());
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
    dispatch(resetFilter());
    dispatch(fetchAllKelas());
  }, [dispatch]);

  const hasActiveFilters = useMemo(() => {
    return isSearching || 
      (filter?.category && filter.category.length > 0) || 
      filter?.priceRange || 
      filter?.rating || 
      filter?.duration ||
      (filter?.sort && filter.sort !== 'asc');
  }, [isSearching, filter]);

  const LoadingSkeleton = React.memo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-300 h-48"></div>
          <div className="p-5">
            <div className="bg-gray-300 h-4 mb-3 rounded"></div>
            <div className="bg-gray-300 h-3 mb-4 rounded w-3/4"></div>
            <div className="flex items-center mb-4">
              <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
              <div className="bg-gray-300 h-3 w-20 rounded"></div>
            </div>
            <div className="bg-gray-300 h-6 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  ));

  const CourseGrid = React.memo(({ courses }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CardClass 
          key={course?.id || course?.kelas_id || `course-${index}`} 
          course={course} 
        />
      ))}
    </div>
  ));


  // Error state
  if (error && courses.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <NavbarHome onSearch={setSearchTerm} />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  Tidak Dapat Memuat Data Kursus
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Memuat...' : 'Coba Lagi'}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <NavbarHome onSearch={setSearchTerm} />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <CardArticle />
          </div>
        </section>

        {/* Main Course Section */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md"
                >
                  {showFilter ? '🔽 Tutup Filter' : '🔼 Buka Filter'}
                </button>
                
                {showFilter && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                    <Filter 
                      courses={courses}
                    />
                  </div>
                )}
              </div>

              {/* Desktop Filter */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-20">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <Filter 
                      courses={courses}
                    />
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="flex-1">
                {/* Header Section */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Koleksi Video Pembelajaran Unggulan 
                  </h2>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Course Count */}
                    <div className="text-gray-700">
                      {loading && courses.length === 0 ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-medium">Sedang memuat data...</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-lg font-semibold">
                            {filteredCourses.length} kursus ditemukan
                          </span>
                          {courses.length !== filteredCourses.length && (
                            <span className="text-sm text-gray-500 ml-2">
                              (dari {courses.length} total kursus)
                            </span>
                          )}
                          {isSearching && searchTerm && (
                            <div className="mt-1">
                              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                🔍 "{searchTerm}"
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Active Filters */}
                    {hasActiveFilters && (
                      <div className="flex flex-wrap items-center gap-2">
                        {filter.category?.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            📚 {filter.category.length} kategori
                          </span>
                        )}
                        {filter.priceRange && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            💰 Rentang harga
                          </span>
                        )}
                        {filter.rating && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            ⭐ Rating {filter.rating}+
                          </span>
                        )}
                        {filter.duration && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            ⏱️ Durasi
                          </span>
                        )}
                        <button
                          onClick={handleResetFilters}
                          className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-full text-sm font-medium border border-orange-200 transition-colors"
                        >
                          🔄 Reset Semua
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Course Grid */}
                <div className="min-h-[400px]">
                  {loading && courses.length === 0 ? (
                    <LoadingSkeleton />
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gray-50 rounded-xl p-12 max-w-lg mx-auto border border-gray-200">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Tidak Ada Kursus Ditemukan
                        </h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                          {isSearching 
                            ? `Maaf, tidak ada kursus yang cocok dengan pencarian "${searchTerm}". Coba gunakan kata kunci lain atau ubah filter.`
                            : "Tidak ada kursus yang sesuai dengan filter yang dipilih. Coba sesuaikan kriteria pencarian Anda."
                          }
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md"
                        >
                          🔄 Tampilkan Semua Kursus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <CourseGrid courses={filteredCourses} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 py-8 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-7xl mx-auto">
            <CardNewslt />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;