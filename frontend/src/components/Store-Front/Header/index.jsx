import React from "react";

const collections = [
  {
    name: "Women's",
    href: "#",
    imageSrc: "/turkfy/cosmetics.jpg",
    imageAlt: "Woman wearing a comfortable cotton t-shirt.",
  },
  {
    name: "Men's",
    href: "#",
    imageSrc: "/turkfy/electronics.jpg",
    imageAlt: "Man wearing a comfortable and casual cotton t-shirt.",
  },
  {
    name: "Desk Accessories",
    href: "#",
    imageSrc: "/turkfy/furniture.jpg",
    imageAlt:
      "Person sitting at a wooden desk with paper note organizer, pencil and tablet.",
  },
  {
    name: "Clothing",
    href: "#",
    imageSrc: "/turkfy/clothing.jpg",
    imageAlt:
      "Person sitting at a wooden desk with paper note organizer, pencil and tablet.",
  },
];

export const StoreFrontHeader = () => {
  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="relative">
          {/* Background image and overlap */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden sm:flex sm:flex-col"
          >
            <div className="relative w-full flex-1 bg-gray-800">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src="/turkfy/mockup.jpg"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gray-900 opacity-50" />
            </div>
            <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">
            {/* Background image and overlap */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col sm:hidden"
            >
              <div className="relative w-full flex-1 bg-gray-800">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src="/turkfy/mockup.jpg"
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gray-900 opacity-50" />
              </div>
              <div className="h-48 w-full bg-white" />
            </div>
            <div className="relative py-32">
              <h1 className="text-white text-6xl font-bold">
                Connecting The World With Switzerland
              </h1>
              {/* <button className="inline-block rounded-md border-2  border-[#cb202c] bg-[#cb202c] px-8 py-3 text-white hover:bg-[#cb202c]/65 font-bold transition-all">
                  Shop Collection
                </button> */}
            </div>
          </div>

          <section
            aria-labelledby="collection-heading"
            className="relative -mt-96 sm:mt-0"
          >
            <h2 id="collection-heading" className="sr-only">
              Collections
            </h2>
            <div className="mx-auto grid max-w-md grid-cols-1 gap-6 px-4 sm:max-w-7xl sm:grid-cols-2 md:grid-cols-4 sm:px-6 lg:px-8">
              {collections?.map((collection) => (
                <div
                  key={collection.name}
                  className="relative bg-white rounded-lg shadow-xl group"
                >
                  <div
                    aria-hidden="true"
                    className="overflow-hidden rounded-lg"
                  >
                    <img
                      src={collection.imageSrc}
                      alt={collection.imageAlt}
                      className="object-cover w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
