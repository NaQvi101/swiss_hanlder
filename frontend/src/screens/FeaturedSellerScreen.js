import axios from "axios";
import React, { useEffect, useReducer } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams } from "react-router-dom";
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
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    case "FETCH_SELLER_REQUEST":
      return { ...state, loadingSeller: true };
    case "FETCH_SELLER_SUCCESS":
      return { ...state, user: action.payload, loadingSeller: false };
    case "FETCH_SELLER_FAIL":
      return { ...state, error: action.payload, loadingSeller: false };

    default:
      return state;
  }
};

export default function FeaturedSellerScreen(props) {
  const [{ loading, error, products, loadingSeller, user }, dispatch] =
    useReducer(reducer, {
      products: [],
      user: {},
      loading: true,
      error: "",
    });

  const params = useParams();
  const { id: sellerId } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        // const result = await axios.get(
        //   `${API_URL}api/products?seller=${sellerId}`
        // );
        const result = await axios.get(`${API_URL}api/products/seller`, {
          params: {
            id: sellerId,
          },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: result.data });

        dispatch({ type: "FETCH_SELLER_REQUEST" });
        const user = await axios.get(`${API_URL}api/users/seller/${sellerId}`);
        dispatch({ type: "FETCH_SELLER_SUCCESS", payload: user.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        dispatch({ type: "FETCH_SELLER_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [sellerId]);

  console.log("user", user);

  return (
    <>
      <Row>
        <Col md={12}>
          {loadingSeller ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Card>
              <div className="flex flex-col"></div>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Card.Img
                        className="thumbnail"
                        src={user?.logo}
                        alt={user?.name}
                      />
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Rating
                        rating={user?.seller?.rating}
                        numReviews={user?.seller?.numReviews}
                      ></Rating>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{user?.name}</Col>
                      <Col>
                        <Badge bg="danger">
                          {" "}
                          <a
                            className="text-decoration-none text-white"
                            href={`mailto:${user?.email}`}
                          >
                            Contact Seller
                          </a>
                        </Badge>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Row>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                {products?.map((product) => (
                  <Col xs={6} md={4} lg={4} key={product.slug} className="mb-3">
                    <Product key={product._id} product={product}></Product>
                  </Col>
                ))}
              </>
            )}
          </Row>
        </Col>
      </Row>
      {user.videoUrl && (
        <Row>
          <Col md={12}>
            <div className="video-section bg-[#cb202c] p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-white">
                Profile Video
              </h3>
              <video
                src={user.videoURL}
                controls
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
