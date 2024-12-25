import { useEffect, useReducer } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import ProductExample from "../components/Products";
import Example from "../components/Store-Front";
import { StoreFrontHeader } from "../components/Store-Front/Header";
import { API_URL } from "../utils";

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

const HomeScreen = () => {
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
    <div>
      <Helmet>
        <title>Turkfy</title>
      </Helmet>

      <StoreFrontHeader />

      <ProductExample />

      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products?.map((product) => (
              <Col xs={6} md={4} lg={3} key={product.slug} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
