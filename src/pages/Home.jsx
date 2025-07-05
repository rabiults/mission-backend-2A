import React, { useState, useEffect } from 'react';
import NavbarHome from '../components/organisems/NavbarHome';
import CardArticle from '../components/molecules/CardArticle';
import CardNewslt from '../components/molecules/CardNewslt';
import CourseSection from '../components/organisems/CourseSection';
import Filter from '../components/molecules/Filter';
import Footer from '../components/organisems/Footer';

const Home = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Big 4 Auditor Financial Analyst",
      description: "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan...",
      price: "Rp 300K",
      originalPrice: "Rp 450K",
      image: "/src/assets/images/img-1.png",
      rating: "3.5 (86)",
      category: "Bisnis",
      tutor: {
        name: "Jenna Ortega",
        title: "Senior Accountant di Gojek",
        avatar: "/src/assets/images/av-1.png"
      }
    },
    {
      id: 2,
      title: "Digital Marketing Strategy",
      description: "Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand awareness...",
      price: "Rp 250K",
      originalPrice: "Rp 400K",
      image: "/src/assets/images/img-2.png",
      rating: "4.2 (124)",
      category: "Pemasaran",
      tutor: {
        name: "Michael Chen",
        title: "Marketing Director di Tokopedia",
        avatar: "/src/assets/images/av-2.png"
      }
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      description: "Kuasai dasar-dasar desain UI/UX untuk menciptakan pengalaman pengguna yang optimal...",
      price: "Rp 350K",
      originalPrice: "Rp 500K",
      image: "/src/assets/images/img-3.png",
      rating: "4.0 (98)",
      category: "Desain",
      tutor: {
        name: "Sarah Johnson",
        title: "Senior Designer di Gojek",
        avatar: "/src/assets/images/av-3.png"
      }
    },
    {
      id: 4,
      title: "Leadership & Management Skills",
      description: "Kembangkan kemampuan kepemimpinan dan manajemen untuk karir yang lebih baik...",
      price: "Rp 400K",
      originalPrice: "Rp 600K",
      image: "/src/assets/images/img-4.png",
      rating: "4.5 (156)",
      category: "Pengembangan Diri",
      tutor: {
        name: "David Wilson",
        title: "HR Director di Shopee",
        avatar: "/src/assets/images/av-4.png"
      }
    },
    {
      id: 5,
      title: "Social Media Marketing",
      description: "Strategi pemasaran media sosial yang terbukti efektif meningkatkan engagement...",
      price: "Rp 200K",
      originalPrice: "Rp 350K",
      image: "/src/assets/images/img-5.png",
      rating: "3.8 (72)",
      category: "Pemasaran",
      tutor: {
        name: "Lisa Anderson",
        title: "Social Media Specialist",
        avatar: "/src/assets/images/av-5.png"
      }
    },
    {
      id: 6,
      title: "Graphic Design Mastery",
      description: "Pelajari teknik desain grafis profesional dengan tools industry standard...",
      price: "Rp 320K",
      originalPrice: "Rp 480K",
      image: "/src/assets/images/img-6.png",
      rating: "4.1 (89)",
      category: "Desain",
      tutor: {
        name: "Robert Taylor",
        title: "Creative Director di KPMG",
        avatar: "/src/assets/images/av-6.png"
      }
    },
    {
      id: 7,
      title: "Personal Branding",
      description: "Bangun personal brand yang kuat untuk meningkatkan kredibilitas profesional...",
      price: "Rp 280K",
      originalPrice: "Rp 420K",
      image: "/src/assets/images/img-7.png",
      rating: "4.3 (143)",
      category: "Pengembangan Diri",
      tutor: {
        name: "Emma Martinez",
        title: "Personal Branding Coach",
        avatar: "/src/assets/images/av-7.png"
      }
    },
    {
      id: 8,
      title: "Business Strategy & Planning",
      description: "Rencana strategis bisnis yang komprehensif untuk startup dan perusahaan...",
      price: "Rp 450K",
      originalPrice: "Rp 650K",
      image: "/src/assets/images/img-8.png",
      rating: "3.9 (67)",
      category: "Bisnis",
      tutor: {
        name: "James Brown",
        title: "Business Consultant",
        avatar: "/src/assets/images/av-8.png"
      }
    },
    {
      id: 9,
      title: "Content Marketing Strategy",
      description: "Strategi content marketing yang efektif untuk membangun audience dan konversi...",
      price: "Rp 275K",
      originalPrice: "Rp 425K",
      image: "/src/assets/images/img-1.png",
      rating: "4.4 (112)",
      category: "Pemasaran",
      tutor: {
        name: "Maria Garcia",
        title: "Content Marketing Manager",
        avatar: "/src/assets/images/av-9.png"
      }
    }
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [showFilter, setShowFilter] = useState(false);

  const parsePriceToNumber = (priceString) => {
    return parseInt(priceString.replace(/[^0-9]/g, ''));
  };

  const parseRating = (ratingString) => {
    return parseFloat(ratingString.split(' ')[0]);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...courses];

    if (filters.category.length > 0) {
      filtered = filtered.filter(course => 
        filters.category.includes(course.category)
      );
    }

  
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(course => {
        const coursePrice = parsePriceToNumber(course.price);
        return coursePrice >= minPrice && coursePrice <= maxPrice;
      });
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(course => {
        const courseRating = parseRating(course.rating);
        return courseRating >= minRating;
      });
    }

    setFilteredCourses(filtered);
  };

  
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

 
  const SafeComponent = ({ children, fallback = null }) => {
    try {
      return children;
    } catch (error) {
      console.error('Component render error:', error);
      return fallback;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50"> 
        <NavbarHome />

      <main className="pt-16"> 
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
              <CardArticle />
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Desktop */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-20">
                  <Filter 
                    courses={courses} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
              </div>

              {/* Mobile Filter  - toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {showFilter ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                </button>
              </div>

              {/* Mobile Filter */}
              {showFilter && (
                <div className="lg:hidden mb-6">
                  <Filter 
                    courses={courses} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
              )}

              {/* Course Content */}
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Koleksi Video Pembelajaran Unggulan
                  </h2>
                  <p className="text-gray-600">
                    Jelajahi {filteredCourses.length} course yang tersedia
                  </p>
                </div>
                  <CourseSection courses={filteredCourses} />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
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