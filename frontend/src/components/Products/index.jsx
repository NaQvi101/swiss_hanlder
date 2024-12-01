import { useEffect, useReducer } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import logger from "use-reducer-logger";
import { API_URL } from "../../utils";

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  // More products...
];

export default function ProductExample() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, products: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, error: action.payload, loading: false };
      case "FETCH_SELLER_REQUEST":
        return { ...state, loadingSellers: true };
      case "FETCH_SELLER_SUCCESS":
        return { ...state, sellers: action.payload, loadingSellers: false };
      case "FETCH_SELLER_FAIL":
        return { ...state, error: action.payload, loadingSellers: false };

      default:
        return state;
    }
  };

  const [{ loading, error, products, loadingSellers, sellers }, dispatch] =
    useReducer(logger(reducer), {
      products: [],
      sellers: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.get(`${API_URL}api/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });

        dispatch({ type: "FETCH_SELLER_REQUEST" });
        const sellers = await axios.get(`${API_URL}api/users/top-sellers`);
        dispatch({ type: "FETCH_SELLER_SUCCESS", payload: sellers.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
        dispatch({ type: "FETCH_SELLER_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Top Sellers
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sellers?.map((seller) => (
            <div key={seller._id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={seller.seller.logo}
                  alt={seller.seller.logo}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {seller.seller.name}
                    </a>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">$20</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
