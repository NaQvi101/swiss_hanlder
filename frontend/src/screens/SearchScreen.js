import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { API_URL, getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [showFilter, setShowFilter] = useState(false);

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="flex min-h-full flex-1 md:flex-row flex-col justify-center py-12 sm:gap-6 gap-4">
        <button
          variant="light"
          onClick={() => setShowFilter(!showFilter)}
          className="text-[#cb202c] md:hidden rounded-md ml-auto border-[#cb202c] p-0  min-w-9 min-h-9 w-max  hover:border-[#cb202c] border-1 hover:bg-transparent mr-1 hover:text-[#cb202c]"
        >
          <i className="fas fa-bars "></i>
        </button>

        <div
          className={`lg:w-1/4 md:w-2/4 w-full ${
            showFilter
              ? "fixed top-0 right-0 z-40 max-h-screen overflow-auto"
              : "fixed top-0 right-[-1000px] z-40 max-h-screen overflow-auto"
          } bg-[#fff] shadow-2xl border md:relative md:right-0 border-gray-200 transition-all duration-1000 rounded-none h-full py-4 flex flex-col gap-4`}
        >
          <button
            variant="light"
            onClick={() => setShowFilter(!showFilter)}
            className="text-[#cb202c] ml-auto md:hidden rounded-md border-[#cb202c] p-0  min-w-9 min-h-9 w-max  hover:border-[#cb202c] border-1 hover:bg-transparent mr-1 hover:text-[#cb202c]"
          >
            <i className="fas fa-times "></i>
          </button>
          <h3 className="text-lg text-[#212529] font-bold px-3 cursor-pointer ">
            Department
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                className={`block ${
                  category === "all"
                    ? "font-bold text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg bg-[#cb202c] text-[#fff]"
                    : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                }`}
                to={getFilterUrl({ category: "all" })}
              >
                Any
              </Link>
            </li>
            {categories?.map((c) => (
              <li key={c}>
                <Link
                  className={`block ${
                    category === c?.name
                      ? "font-bold text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg bg-[#cb202c] text-[#fff]"
                      : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                  }`}
                  to={getFilterUrl({ category: c?.name })}
                >
                  {c?.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="text-lg text-[#212529] font-bold px-3 cursor-pointer">
            Price
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                className={`block ${
                  price === "all"
                    ? "font-bold  text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg bg-[#cb202c] text-[#fff]"
                    : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                }`}
                to={getFilterUrl({ price: "all" })}
              >
                Any
              </Link>
            </li>
            {prices?.map((p) => (
              <li key={p.value}>
                <Link
                  className={`block ${
                    price === p.value
                      ? "font-bold text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg bg-[#cb202c] text-[#fff]"
                      : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                  }`}
                  to={getFilterUrl({ price: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="text-lg text-[#212529] font-bold px-3 cursor-pointer">
            Avg. Customer Review
          </h3>
          <ul className="flex ratings flex-col gap-2">
            {ratings?.map((r) => (
              <li key={r.name}>
                <Link
                  className={`block ${
                    rating === r.rating.toString()
                      ? "font-bold text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg active-rating bg-[#cb202c] text-[#fff]"
                      : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                  }`}
                  to={getFilterUrl({ rating: r.rating })}
                >
                  <Rating caption={" & up"} rating={r.rating}></Rating>
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={`block ${
                  rating === "all"
                    ? "font-bold  text-sm leading-6 cursor-pointer px-[20px] py-2 transition-all shadow-lg active-rating bg-[#cb202c] text-[#fff]"
                    : "font-semibold hover:font-bold text-sm leading-6 text-[#212529] cursor-pointer px-[20px] py-2 transition-all hover:shadow-lg hover:bg-[#cb202c] hover:text-white"
                }`}
                to={getFilterUrl({ rating: "all" })}
              >
                <Rating caption={" & up"} rating={0}></Rating>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:w-3/4 w-full pl-4">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="flex justify-between md:flex-row flex-col gap-2 items-center mb-3">
                <div className="text-base w-full font-normal text-gray-800">
                  {countProducts === 0 ? "No" : countProducts} Results
                  {query !== "all" && `: ${query}`}
                  {category !== "all" && `: ${category}`}
                  {price !== "all" && `: Price ${price}`}
                  {rating !== "all" && `: Rating ${rating} & up`}
                  {(query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all") && (
                    <button
                      className="ml-2 bg-gray-200 px-2 py-1 rounded-md"
                      onClick={() => navigate("/search")}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  )}
                </div>
                <div className="text-right  w-full flex gap-3 align-middle items-center">
                  <span className="text-gray-800">Sort by</span>
                  <select
                    className="border rounded-md py-2 text-gray-800 font-semibold text-base px-4"
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </div>
              </div>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <div className=" grid grid-cols-2 gap-2 sm:gap-4 sm:mx-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {products?.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <div>
                  <nav
                    className="flex rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    {[...Array(pages).keys()]?.map((x) => (
                      <Link
                        key={x + 1}
                        to={getFilterUrl({ page: x + 1 })}
                        className={`${
                          Number(page) === x + 1
                            ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-[#fff] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "relative items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 inline-flex"
                        }`}
                      >
                        {x + 1}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
