import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { API_URL, getError } from "../utils";
import { axios } from "axios";

const CategoryScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [categoriesList, setCategoriesList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    try {
      const result = await fetch(`${API_URL}api/products/categories`);
      const categories = await result.json();
      console.log("categories ", categories);
      setCategoriesList(categories);
    } catch (err) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const submitHandler = async () => {
    // const slug = formData.category_name.toLowerCase().replaceAll(" ", "_");
    const result = await fetch(`${API_URL}api/products/categories`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(formData), // body data type must match "Content-Type" header
    }).then((response) => response.json());
    if (result.message) {
      setFormData({});
      setShowForm(false);
    }
  };
  return (
    <>
      <div className="container py-6">
        {!showForm ? (
          <>
            <div className="flex align-middle justify-between items-center w-full">
              <h1 className="text-3xl font-bold text-gray-700">
                Product Categories
              </h1>
              <button
                className="block rounded-md bg-[#cb202c] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500  outline-none "
                type="button"
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Create Category
              </button>
            </div>
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Id
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categoriesList?.map((item) => {
                      return (
                        <tr key="{person.email}">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {item?._id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.slug}
                          </td>
                          <td className="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm flex alinmi items-center gap-3 font-medium sm:pr-0">
                            <span className="text-red-600 font-bold text-xs">
                              Delete
                            </span>
                            <span className="text-indigo-600 font-bold text-xs">
                              Edit
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-700">
              Product Categories
            </h1>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[500px]">
              <div className="bg-white px-6 py-12 rounded-lg shadow sm:rounded-lg sm:px-12">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="c_name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Category Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="c_name"
                        name="c_name"
                        type="text"
                        autoComplete="c_name"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            category_name: e.target.value,
                          });
                        }}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={submitHandler}
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#cb202c] px-3 py-1.5 text-sm font-bold transition-all leading-6 text-white hover:text-[#cb202c] shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          ""
        )} */}
      </div>
    </>
  );
};

export default CategoryScreen;
