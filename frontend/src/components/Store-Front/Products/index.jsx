import React, { useState } from "react";
import { useEffect, useReducer } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../../Product";
import LoadingBox from "../../LoadingBox";
import MessageBox from "../../MessageBox";
import { API_URL } from "../../../utils";

const trendingProducts = [
  {
    id: 1,
    name: "Leather Long Wallet",
    color: "Natural",
    price: "$75",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-04-trending-product-02.jpg",
    imageAlt: "Hand stitched, orange leather long wallet.",
  },
  // More products...
];

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

export const StoreFrontProducts = () => {
  const [{ loading, error, products, loadingSellers, sellers }, dispatch] =
    useReducer(logger(reducer), {
      products: [],
      sellers: [],
      loading: true,
      error: "",
    });

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [furnitureProducts, setFurnitureProducts] = useState([]);
  const [cosmeticsProducts, setCosmeticsProducts] = useState([]);
  const [clothingProducts, setClothingProducts] = useState([]);
  const [curatedClothingProducts, setCuratedClothingProducts] = useState([]);

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

  useEffect(() => {
    const shuffledProducts = products.sort(() => Math.random() - 0.5);
    // Select the first 3 products from shuffled array
    const trending = shuffledProducts.slice(0, 3);
    setTrendingProducts(trending);
    const electronics = products?.filter(
      (item) => item?.category === "Electronics"
    );
    setElectronicsProducts(electronics);
    const furniture = products?.filter(
      (item) => item?.category === "Furniture"
    );
    setFurnitureProducts(furniture);
    const cosmetics = products?.filter(
      (item) => item?.category === "Cosmetics"
    );
    setCosmeticsProducts(cosmetics);
    const cloths = products?.filter((item) => item?.category === "Clothing");
    setClothingProducts(cloths);
    const clothing = products?.filter(
      (item) => item?.category === "Manufacturers"
    );
    setCuratedClothingProducts(clothing);
  }, [products]);

  return (
    <section aria-labelledby="trending-heading">
      {/* Trending */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Trending Products
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {trendingProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Electronics */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Electronics
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {electronicsProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Furniture  */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Furniture
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {furnitureProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Cosmetics */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Cosmetics
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {cosmeticsProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Clothing */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Clothing
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {clothingProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Manufacturers */}
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col gap-10">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-4xl font-bold text-gray-700"
          >
            Manufacturers
          </h2>
        </div>

        <div className="block">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-4">
              {curatedClothingProducts?.map((product) => (
                <div key={product.slug} className="mb-3">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
