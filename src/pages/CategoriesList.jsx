import { useContext, useState, useEffect } from "react";
import categoriesContext from "../context/CategoriesContext";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function CategoriesList() {
  const location = useLocation();
  const {
    genresList,
    genresDetails,
    isFetching,
    categoryType,
    setCategoryType,
    setGenresId,
  } = useContext(categoriesContext);

  const [genreName, setGenreName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ✅ Dynamically update categoryType based on route state
  useEffect(() => {
    if (location.state?.categoryType) {
      setCategoryType(location.state.categoryType);
    } else {
      setCategoryType("movie"); // default fallback
    }
  }, [location.state?.categoryType]);

  // ✅ Set genre name & id from state or fallback to first genre
  useEffect(() => {
    if (genresList.length > 0) {
      const genreFromState = location.state?.genreName;
      const matchedGenre = genresList.find((g) => g.name === genreFromState);

      if (genreFromState && matchedGenre) {
        setGenreName(matchedGenre.name);
        setGenresId(matchedGenre.id);
      } else {
        setGenreName(genresList[0].name);
        setGenresId(genresList[0].id);
      }

      setCurrentPage(1);
    }
  }, [categoryType, genresList, location.state?.genreName]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-12 h-12 border-4 border-[#999999] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredGenresList = genresList.filter((genre) => {
    if (categoryType === "tv") {
      return ![99, 10402, 9648].includes(genre.id);
    } else {
      return ![10770, 37].includes(genre.id);
    }
  });

  const filteredItems = genresDetails.filter((item) =>
    item.genre_ids.some((id) => {
      const match = genresList.find((g) => g.id === id);
      return match?.name === genreName;
    })
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (direction) => {
    scrollTo(0, 0);
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="text-white px-20 xl-max:px-10 sm-max:px-3 mt-5 mb-5">
      {/* Toggle Button */}
      <div className="flex justify-center bg-[#0F0F0F] p-1 rounded-lg border border-[#262626] w-fit mb-5 mx-auto">
        <button
          className={`px-6 py-2 rounded-lg transition-all ${categoryType === "movie" ? "bg-[#1F1F1F] text-white" : "text-[#999999]"
            }`}
          onClick={() => setCategoryType("movie")}
        >
          Movies
        </button>
        <button
          className={`px-6 py-2 rounded-lg transition-all ${categoryType === "tv" ? "bg-[#1F1F1F] text-white" : "text-[#999999]"
            }`}
          onClick={() => setCategoryType("tv")}
        >
          TV Shows
        </button>
      </div>

      {/* Genres List */}
      <div className="flex justify-start items-center py-2 gap-2 text-nowrap w-full max-w-6xl mx-auto overflow-x-auto no-scrollbar scroll-pl-4">
        {filteredGenresList.map((item) => (
          <button
            key={item.id}
            className={`px-2 py-2 rounded-lg border  font-semibold transition-transform duration-300 hover:scale-110 ${item.name === genreName ? "bg-[#E50000] border-[#E50000]" : "bg-[#1A1A1A] border-[#262626]"
              }`}
            onClick={() => {
              setGenreName(item.name);
              setGenresId(item.id);
              setCurrentPage(1);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="md:border md:border-[#262626] md:rounded-xl md:px-2 mt-10">
        <h2 className="inline font-bold text-xl md:text-lg mb-2 relative bottom-4 left-9 rounded-lg px-3 py-2 bg-[#E50000]">
          {genreName}
        </h2>
        <div className="grid grid-cols-5 xl-max:grid-cols-4 md-max:grid-cols-2 sm-max:grid-cols-1 gap-7 m-10">
          {paginatedItems.map((item) => (
            <Link
              key={item.id}
              to={`/${categoryType}/${item.id}`}
              className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-4 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
            >
              <div>
                <img
                  className="rounded-lg w-[250px] mx-auto"
                  src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                  alt={item.title || item.name || "Poster"}
                />
                <div className="text-center mt-2 font-bold">
                  {item.title || item.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            className="bg-[#0F0F0F] bg-opacity-50 border border-[#262626] p-3 rounded-full transition-transform duration-300 hover:scale-110"
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
          >
            <FaArrowLeft />
          </button>
          <span className="px-4 py-2 text-[#BFBFBF]">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className="bg-[#0F0F0F] bg-opacity-50 border border-[#262626] p-3 rounded-full transition-transform duration-300 hover:scale-110"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoriesList;
