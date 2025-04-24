'use client'
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  
  const slides = [
    {
      image: "https://placehold.co/1200x400/3B82F6/FFFFFF?text=Summer+Collection",
      title: "Summer Collection",
      description: "Discover our brand new summer collection",
      btnText: "Shop Now",
      btnLink: "/shop"
    },
    {
      image: "https://placehold.co/1200x400/10B981/FFFFFF?text=New+Arrivals",
      title: "New Arrivals",
      description: "Check out the latest products in our catalog",
      btnText: "View Products",
      btnLink: "/new-arrivals"
    },
    {
      image: "https://placehold.co/1200x400/EF4444/FFFFFF?text=Limited+Offer",
      title: "Limited Time Offer",
      description: "Get up to 50% off on select items",
      btnText: "See Offers",
      btnLink: "/offers"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  }, [current, slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  }, [current, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute bottom-0 left-0 p-8 z-20 text-white max-w-lg">
            <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
            <p className="mb-4">{slide.description}</p>
            <Link
              href={slide.btnLink}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              {slide.btnText}
            </Link>
          </div>
        </div>
      ))}
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full z-30 hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full z-30 hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;