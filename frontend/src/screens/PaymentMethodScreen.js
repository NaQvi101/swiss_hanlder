import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);

    navigate("/placeorder");
  };

  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="flex min-h-full flex-1 flex-col justify-center pb-6 sm:px-6 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Payment
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[500px]">
          <div className="bg-white px-6 py-12 rounded-lg shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Payment Method
                </label>
                <div className="mt-2">
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    <div key="PayPal" className="flex items-center">
                      <input
                        id="PayPal"
                        name="payment-method"
                        type="radio"
                        value="PayPal"
                        checked={paymentMethodName === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="PayPal"
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        PayPal
                      </label>
                    </div>
                    <div key="Stripe" className="flex items-center">
                      <input
                        id="Stripe"
                        name="payment-method"
                        type="radio"
                        value="Stripe"
                        checked={paymentMethodName === "Stripe"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="Stripe"
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        Stripe
                      </label>
                    </div>
                  </div>
                  {/* <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  /> */}
                </div>
              </div>
              <div>
                <button
                  onClick={submitHandler}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#cb202c] px-3 py-1.5 text-sm font-bold transition-all leading-6 text-white hover:text-[#cb202c] shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div> */}
    </div>
  );
}
