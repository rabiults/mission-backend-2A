import React from 'react';

const CardClass = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div class="text-white text-center">
                  <div class="w-16 h-16 mx-auto mb-2 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <p class="text-xs font-medium">Video Course</p>
                </div>
              </div>
            `;
          }}
        />
        
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-2">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center mb-3">
          <img 
            src={course.tutor.avatar} 
            alt={course.tutor.name}
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{course.tutor.name}</p>
            <p className="text-xs text-gray-500">{course.tutor.title}</p>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <img 
            src="/src/assets/images/Rating.png" 
            alt="Rating"
            className="h-4 mr-2"
          />
          <span className="text-sm text-gray-600">{course.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">{course.price}</span>
            <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardClass;