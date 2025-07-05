import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BookIcon from '../../assets/images/icons/book.png';
import ClockIcon from '../../assets/images/icons/jam.png';
import RpIcon from '../../assets/images/icons/rp.png';
import RatingIcon from '../../assets/images/icons/rating.png';





const Filter = ({ onFilterChange, courses = [] }) => {
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    priceRange: '',
    rating: '',
    duration: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    rating: false,
    duration: false
  });

  const categories = [...new Set(courses.map(course => course.category))];

  const priceRanges = [
    { label: 'Kurang dari Rp 200K', value: '0-200000' },
    { label: 'Rp 200K - Rp 300K', value: '200000-300000' },
    { label: 'Rp 300K - Rp 400K', value: '300000-400000' },
    { label: 'Lebih dari Rp 400K', value: '400000-999999' }
  ];

  const ratings = [
    { label: '4.0 ke atas', value: '4.0' },
    { label: '3.5 ke atas', value: '3.5' },
    { label: '3.0 ke atas', value: '3.0' }
  ];

  const durations = [
    { label: 'Kurang dari 4 Jam', value: '0-4' },
    { label: '4 - 8 Jam', value: '4-8' },
    { label: 'Lebih dari 8 Jam', value: '8+' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = activeFilters.category.includes(category)
      ? activeFilters.category.filter(cat => cat !== category)
      : [...activeFilters.category, category];
    
    const newFilters = { ...activeFilters, category: newCategories };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      category: [],
      priceRange: '',
      rating: '',
      duration: ''
    };
    setActiveFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const FilterSection = ({ icon, title, isExpanded, onToggle, children }) => (
    <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-md">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-green-600 hover:text-green-700"
      >
        <div className="flex items-center space-x-2">
          <img src={icon} alt="" className="w-5 h-5" />
          <span>{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-orange-600 hover:text-orange-700 font-bold"
        >
          Reset
        </button>
      </div>

      <FilterSection
        icon={BookIcon}
        title="Bidang Studi"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        {categories.map(category => (
          <label key={category} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.category.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500 accent-green-600"
            />
            <span className="text-sm text-gray-700">{category}</span>
          </label>
        ))}
      </FilterSection>


      <FilterSection
        icon={RpIcon}
        title="Harga"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        {priceRanges.map(range => (
          <label key={range.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              value={range.value}
              checked={activeFilters.priceRange === range.value}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="h-4 w-4 text-green-600 border-green-300 focus:ring-green-500 accent-green-600"
            />
            <span className="text-sm text-green-700">{range.label}</span>
          </label>
        ))}
      </FilterSection>

    
      <FilterSection
        icon={RatingIcon}
        title="Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        {ratings.map(rating => (
          <label key={rating.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={rating.value}
              checked={activeFilters.rating === rating.value}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">{rating.label}</span>
          </label>
        ))}
      </FilterSection>

     
      <FilterSection
        icon={ClockIcon}
        title="Durasi"
        isExpanded={expandedSections.duration}
        onToggle={() => toggleSection('duration')}
      >
        {durations.map(duration => (
          <label key={duration.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="duration"
              value={duration.value}
              checked={activeFilters.duration === duration.value}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">{duration.label}</span>
          </label>
        ))}
      </FilterSection>

      {(activeFilters.category.length > 0 || activeFilters.priceRange || activeFilters.rating || activeFilters.duration) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filter Aktif:</h4>
          <div className="space-y-1">
            {activeFilters.category.map(cat => (
              <span key={cat} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1">
                {cat}
              </span>
            ))}
            {activeFilters.priceRange && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                {priceRanges.find(p => p.value === activeFilters.priceRange)?.label}
              </span>
            )}
            {activeFilters.rating && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1">
                Rating {activeFilters.rating}+
              </span>
            )}
            {activeFilters.duration && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1">
                {durations.find(d => d.value === activeFilters.duration)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;