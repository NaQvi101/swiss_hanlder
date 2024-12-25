import React from "react";
import { Link } from "react-router-dom";

const CartItem = ({ product, index, updateCartHandler, removeItemHandler }) => {
  return (
    <div key={index} className="flex py-6 sm:py-10 gap-4 flex-col md:flex-row">
      <div className="flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>
      <div className="md:ml-4 ml-0 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 flex flex-col justify-between h-full">
          <div className="flex justify-between flex-col gap-2">
            <div className="flex justify-between flex-col">
              <h3 className="text-sm">
                <Link
                  className="font-medium text-gray-700 hover:text-gray-800"
                  to={`/product/${product.slug}`}
                >
                  {product.name}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">{product.description}</p>
              {product.brand ? (
                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                  {product.brand}
                </p>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-bold text-gray-900">
              ${product.price}
            </p>
          </div>
          {updateCartHandler && removeItemHandler ? (
            <>
              <div className="flex gap-2 justify-between mt-4 md:mt-0 items-center">
                <div className="flex gap-2 items-center">
                  <div
                    className={`h-10 w-10 rounded-full ${
                      product.quantity === 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer opacity-100"
                    }  border-2 flex-col transition-all text-[#cb202c] hover:text-white hover:bg-[#cb202c] border-[#cb202c] flex align-middle justify-center items-center`}
                    onClick={() =>
                      updateCartHandler(product, product.quantity - 1)
                    }
                    disabled={product.quantity === 1}
                  >
                    <i className="fas fa-minus-circle"></i>
                  </div>{" "}
                  <span className="text-[#cb202c] font-semibold text-lg">
                    {product.quantity}
                  </span>{" "}
                  <div
                    onClick={() =>
                      updateCartHandler(product, product.quantity + 1)
                    }
                    variant="light"
                    className={`h-10 w-10 rounded-full ${
                      product.quantity === product.countInStock
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer opacity-100"
                    }  border-2 flex-col transition-all text-[#cb202c] hover:text-white hover:bg-[#cb202c] border-[#cb202c] flex align-middle justify-center items-center`}
                    disabled={product.quantity === product.countInStock}
                  >
                    <i className="fas fa-plus-circle"></i>
                  </div>
                </div>
                <div
                  onClick={() => removeItemHandler(product)}
                  className={`h-10 w-10 rounded-full cursor-pointer opacity-100 border-2 flex-col text-[#cb202c] hover:text-white transition-all hover:bg-[#cb202c] border-[#cb202c] flex align-middle justify-center items-center`}
                >
                  <i className="fas fa-trash"></i>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
