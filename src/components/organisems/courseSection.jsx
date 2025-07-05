import React, { useState, useMemo } from 'react';
import SearchCourse from '../molecules/SearchCourse';
import CardClass from '../molecules/CardClass';

const CourseSection = ({ courses = [] }) => {
  const [activeCategory, setActiveCategory] = useState('Semua Kelas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = [
    'Semua Kelas',
    'Pemasaran',
    'Desain',
    'Pengembangan Diri',
    'Bisnis'
  ];

  const sortOptions = [
    { value: '', label: 'Urutkan' },
    { value: 'price-low', label: 'Harga Rendah' },
    { value: 'price-high', label: 'Harga Tinggi' },
    { value: 'a-z', label: 'A to Z' },
    { value: 'z-a', label: 'Z to A' },
    { value: 'rating-high', label: 'Rating Tertinggi' },
    { value: 'rating-low', label: 'Rating Terendah' }
  ];

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    if (activeCategory !== 'Semua Kelas') {
      filtered = filtered.filter(course => course.category === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'a-z':
            return a.title.localeCompare(b.title);
          case 'z-a':
            return b.title.localeCompare(a.title);
          case 'rating-high':
            return (b.rating || 0) - (a.rating || 0);
          case 'rating-low':
            return (a.rating || 0) - (b.rating || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [courses, activeCategory, searchTerm, sortBy]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <SearchCourse 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Cari Kelas"
              />
            </div>
          </div>
        </div>


        {(searchTerm || activeCategory !== 'Semua Kelas' || sortBy) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  Menampilkan {filteredAndSortedCourses.length} hasil untuk "{searchTerm}"
                  {activeCategory !== 'Semua Kelas' && ` dalam kategori ${activeCategory}`}
                  {sortBy && ` - diurutkan berdasarkan ${sortOptions.find(opt => opt.value === sortBy)?.label}`}
                </>
              ) : (
                <>
                  Menampilkan {filteredAndSortedCourses.length} kursus
                  {activeCategory !== 'Semua Kelas' && ` dalam kategori ${activeCategory}`}
                  {sortBy && ` - diurutkan berdasarkan ${sortOptions.find(opt => opt.value === sortBy)?.label}`}
                </>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAndSortedCourses.map((course) => (
            <CardClass key={course.id} course={course} />
          ))}
        </div>

        {filteredAndSortedCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Kursus Tidak Ditemukan' : 'Belum Ada Kursus'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `Tidak ada kursus yang cocok dengan pencarian "${searchTerm}". Coba kata kunci lain.`
                : 'Kursus untuk kategori ini sedang dalam pengembangan.'
              }
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Hapus Pencarian
                </button>
              )}
              {sortBy && (
                <button
                  onClick={() => setSortBy('')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Reset Urutan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSection;