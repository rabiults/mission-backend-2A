import React from "react";

const CardClass = ({ course }) => {
  const courseData = {
    id: course?.id || course?.kelas_id || '',
    title: course?.judul || course?.title || course?.nama || 'Judul Tidak Tersedia',
    description: course?.deskripsi || course?.description || 'Deskripsi tidak tersedia',
    image: course?.gambar || course?.image || course?.thumbnail || null,
    category: course?.nama_kategori || course?.category || course?.kategori || 'Umum',
    instructor: course?.nama_tutor || course?.instructor || course?.tutor || 'Instruktur',
    instructorBio: course?.tutor_bio || course?.instructor_bio || course?.posisi || '',
    instructorAvatar: course?.tutor_avatar || course?.instructor_avatar || course?.avatar || null,
    price: course?.harga || course?.price || 0,
    rating: course?.rating || course?.nilai || 0,
    duration: course?.durasi || course?.duration || 0,
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratis';
    if (typeof price === 'string' && price.includes('K')) return `Rp ${price}`;
    const numPrice = parseInt(String(price).replace(/[^0-9]/g, ''));
    if (numPrice >= 1000) return `Rp ${(numPrice / 1000)}K`;
    return `Rp ${numPrice}`;
  };

  const formatRating = (rating) => {
    const numRating = parseFloat(String(rating).split(' ')[0]) || 0;
    return Math.min(Math.max(numRating, 0), 5);
  };

  const displayRating = formatRating(courseData.rating);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
        {courseData.image ? (
          <img
            src={courseData.image}
            alt={courseData.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 ${courseData.image ? 'hidden' : 'flex'}`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-sm text-gray-600 font-medium">Kelas Online</p>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            {courseData.category}
          </span>
        </div>
      </div>

      {/* Konten */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Judul */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '3.5rem'
        }}>
          {courseData.title}
        </h3>

        {/* Deskripsi */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.5rem'
        }}>
          {courseData.description}
        </p>

        {/* Informasi Instruktur */}
        <div className="flex items-center mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0 relative">
            {courseData.instructorAvatar ? (
              <img
                src={courseData.instructorAvatar}
                alt={courseData.instructor}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span className={`text-white text-sm font-bold absolute inset-0 flex items-center justify-center ${courseData.instructorAvatar ? 'hidden' : 'flex'}`}>
              {courseData.instructor.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {courseData.instructor}
            </p>
            {courseData.instructorBio && (
              <p className="text-xs text-gray-500 truncate">
                {courseData.instructorBio}
              </p>
            )}
          </div>
        </div>

        {/* Rating dan Durasi */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= displayRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {displayRating.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {courseData.duration} jam
          </div>
        </div>

        {/* Harga dan Tombol */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-left">
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(courseData.price)}
            </p>
          </div>
          
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardClass;