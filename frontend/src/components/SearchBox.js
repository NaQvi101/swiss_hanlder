import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  return (
    <Form
      className="flex items-center ml-auto w-full pt-[12px] xl:pt-[0px] "
      onSubmit={submitHandler}
    >
      <div className="relative w-full">
        <input
          className="block w-full px-4 py-2 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10"
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 bg-[#cb202c] border-l border-gray-300 rounded-r-md hover:text-gray-700 focus:outline-none focus:bg-gray-200 focus:text-gray-700"
          type="submit"
          id="button-search"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_1962_4074"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
              style={{ maskType: "luminance" }}
            >
              <path d="M24 0H0V24H24V0Z" fill="white"></path>
            </mask>
            <g mask="url(#mask0_1962_4074)">
              <path
                d="M10.2008 16.6C6.70078 16.6 3.80078 13.7 3.80078 10.2C3.80078 6.70005 6.70078 3.80005 10.2008 3.80005C13.7008 3.80005 16.6008 6.70005 16.6008 10.2C16.6008 13.7 13.7008 16.6 10.2008 16.6ZM10.2008 5.70005C7.70078 5.70005 5.70078 7.70005 5.70078 10.2C5.70078 12.7 7.70078 14.7 10.2008 14.7C12.7008 14.7 14.7008 12.7 14.7008 10.2C14.7008 7.70005 12.7008 5.70005 10.2008 5.70005Z"
                fill="white"
              ></path>
              <path
                d="M16.3259 15.0614L14.9824 16.4049L18.8715 20.294L20.215 18.9505L16.3259 15.0614Z"
                fill="white"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </Form>
  );
}
