import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { API_URL, PRODUCT_QUERY_MESSAGE, getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { sendChat } from "../components/Chat/api";


const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const ProductScreen = () => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const params = useParams();
  const { slug } = params;

  const navigate= useNavigate();

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`${API_URL}api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems?.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`${API_URL}api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry! Product is out of stock.");
      return;
    }

    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    navigate("/cart");
  };

  const chatHandler=async()=>{
    try{
    await sendChat({productId:product?._id,message:PRODUCT_QUERY_MESSAGE,token:userInfo?.token});
    navigate(`/chat/${product?._id}`);
    }
    catch(error){
      console.error("error in sending the chat...");
      console.log(error);
      toast.error("Error in sending the chat");
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Review submitted successfully");

      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });

      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="product-screen-container">
      <Row>
        <Col md={3} />
        <Col md={3}>
          <img
            className="img-large"
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                {product?.seller && (
                  <>
                    <ListGroup.Item>Seller </ListGroup.Item>
                    <ListGroup.Item>
                      <Link to={`/seller/${product.seller?._id}`}>
                        {product.seller?.seller?.name}
                      </Link>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        rating={product.seller.seller.rating}
                        numReviews={product.seller.seller.numReviews}
                      ></Rating>
                    </ListGroup.Item>
                  </>
                )}
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
<ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                      <Button onClick={chatHandler} variant="success" className="flex justify-center items-center gap-2 mt-1">
                        Contact Seller
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} />
      </Row>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images]?.map((x) => (
                  <Col key={x}>
                    <Card className="product-preview-image">
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Description:</b>
              <p>{product.description}</p>
            </ListGroup.Item>
            {/* <ListGroup.Item>
                                Seller{' '}
                                <Link to={`/seller/${product.seller._id}`}>
                                    {product.seller.seller.name}
                                </Link>
                                <Rating
                                    rating={product.seller.seller.rating}
                                    numReviews={product.seller.seller.numReviews}
                                ></Rating>
                            </ListGroup.Item> */}
          </ListGroup>
        </Col>
      </Row>
      <div className="my-3 product-review-container">
        <h2 ref={reviewsRef} className="review-heading">
          <b>Reviews</b>
        </h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews?.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox />}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{" "}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{" "}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
