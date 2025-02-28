import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function TopRated() {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5, slidesToSlide: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, slidesToSlide: 5 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
  };

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZWZiZTAyYjM1YTU4ZTc1MmU0YTYyNjJhOWZkMmFkYyIsIm5iZiI6MTc0MDc1MTQ5My4zNTgsInN1YiI6IjY3YzFjMjg1OWFkY2QyNTYyNTM1YzIyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OvJ5K7QpCiaubjID0pJj146d-S05U_0E6JD0pxV_D_o'
    }
  };

  useEffect(() => {
    if (isFetching) {
      fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
        .then(res => res.json())
        .then(res => {
          setData(res.results);
          setIsFetching(false);
        })
        .catch(err => console.error(err));
    }
  }, [isFetching]);

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="text-white px-20 xl:px-10 md:px-6 sm-max:px-0.5 mt-16 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl lg:text-2xl sm:text-xl mb-6">Top Rated Movies</h2>

        {/* Custom Navigation Buttons (Only for Large Screens) */}
        <div className="hidden md:flex items-center gap-3 bg-black1 px-1.5 py-1.5 rounded-lg border border-gray-900 shadow-md mb-4">
          <button onClick={handlePrev} className="bg-black3 p-2.5 rounded-md border border-gray-900 hover:bg-gray-900 transition-all">
            <ChevronLeft className="text-white w-5 h-5" />
          </button>
          <div className="flex items-center gap-[3px]">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3 h-[2.5px] rounded-md ${index === currentIndex % 4 ? "bg-red1 w-4" : "bg-gray-600"}`}
              ></div>
            ))}
          </div>
          <button onClick={handleNext} className="bg-black3 p-2.5 rounded-md border border-gray-900 hover:bg-gray-900 transition-all">
            <ChevronRight className="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      <Carousel
        ref={carouselRef}
        responsive={responsive}
        infinite={true}
        className="py-3"
        arrows={false}
        swipeable={true}
        draggable={true}
        beforeChange={(nextSlide) => setCurrentIndex(nextSlide % data.length)}
      >
        {data.map((item, index) => (
          <Link to={`/${item.id}`} key={index}>
            <div className='border border-black5 bg-black3 rounded-2xl mx-2 p-4 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out'>
              <img className='w-full rounded-2xl object-cover' src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt="Loading..." />
              <h1 className='text-center font-bold mt-3 text-sm sm:text-base'>{item.title}</h1>
            </div>
          </Link>
        ))}
      </Carousel>

      {/* Small Screen Pagination Indicator */}
      <div className="md:hidden flex justify-center mt-4">
        <div className="w-20 h-1 bg-gray-700 rounded-full relative">
          <div
            className="h-1 bg-red1 rounded-full"
            style={{ width: data.length > 0 ? `${(currentIndex / data.length) * 100}%` : "0%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default TopRated;
