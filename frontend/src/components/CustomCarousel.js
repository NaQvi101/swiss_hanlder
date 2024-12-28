import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CustomCarousel = ({ sellers, autoplay = false, interval = 3000, colors }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayCount, setDisplayCount] = useState(5);

    const getInitials = (name) => {
        const nameParts = name.split(" ");
        if (nameParts.length > 1) {
            return nameParts[0][0] + nameParts[1][0];
        }
        return name[0];
    };

    const colorMap = colors || [
        "bg-red-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-indigo-500",
    ];

    const updateDisplayCount = () => {
        if (window.innerWidth >= 1024) {
            setDisplayCount(5);
        } else if (window.innerWidth >= 768) {
            setDisplayCount(3);
        } else {
            setDisplayCount(1);
        }
    };

    useEffect(() => {
        updateDisplayCount();
        window.addEventListener("resize", updateDisplayCount);
        return () => window.removeEventListener("resize", updateDisplayCount);
    }, []);

    useEffect(() => {
        if (!autoplay) return;
        const intervalId = setInterval(() => {
            handleNext();
        }, interval);
        return () => clearInterval(intervalId);
    }, [autoplay, interval, activeIndex]);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + sellers.length) % sellers.length);
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % sellers.length);
    };

    const getVisibleSellers = () => {
        const visibleSellers = [];
        for (let i = 0; i < displayCount; i++) {
            visibleSellers.push(sellers[(activeIndex + i) % sellers.length]);
        }
        return visibleSellers;
    };

    const getCenterIndex = (visibleSellers) => {
        return Math.floor(visibleSellers.length / 2);
    };

    return (
        <div className="relative w-full py-8 px-4 bg-gray-100">
            <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="absolute left-4 z-10 p-3 text-white bg-[#cb202c] rounded-full hover:bg-gray-600"
                style={{ top: "50%", transform: "translateY(-50%)" }}
            >
                <FaChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
                onClick={handleNext}
                aria-label="Next slide"
                className="absolute right-4 z-10 p-3 text-white bg-[#cb202c] rounded-full hover:bg-gray-600"
                style={{ top: "50%", transform: "translateY(-50%)" }}
            >
                <FaChevronRight size={20} aria-hidden="true" />
            </button>

            <div className="flex justify-center items-center overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out">
                    {getVisibleSellers().map((seller, index) => {
                        const visibleSellers = getVisibleSellers();
                        const centerIndex = getCenterIndex(visibleSellers);
                        const isCenter = index === centerIndex;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center justify-center ${displayCount === 1 ? "w-72 h-80" : displayCount === 3 ? "w-60 h-72" : "w-48 h-64"
                                    } mx-2 bg-white rounded-lg shadow-sm transform m-3 transition-transform ${isCenter ? "scale-110 shadow-2xl" : "scale-95"
                                    }`}
                                style={{
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                <div
                                    className={`flex items-center justify-center ${displayCount === 1
                                        ? "w-32 h-32 text-3xl"
                                        : displayCount === 3
                                            ? "w-28 h-28 text-2xl"
                                            : "w-24 h-24 text-xl"
                                        } font-bold text-white rounded-full ${colorMap[index % colorMap.length]
                                        }`}
                                >
                                    {getInitials(seller.name)}
                                </div>
                                <p className="mt-4 text-center text-lg font-semibold text-gray-700">
                                    {seller.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomCarousel;

// Usage example:
// const sellers = [
//   { name: "John Doe" },
//   { name: "Jane Smith" },
//   { name: "Alice" },
//   { name: "Bob Marley" },
//   { name: "Charlie Brown" },
//   { name: "Diana Prince" },
// ];
// <CustomCarousel sellers={sellers} autoplay={true} interval={4000} />;
