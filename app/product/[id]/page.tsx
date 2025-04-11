"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");

  // Mock product data - in a real app, you would fetch this from an API based on the ID
  const product = {
    id,
    title: "Premium Cotton T-Shirt",
    price: 49.99,
    discountPercentage: 20,
    discountedPrice: 39.99,
    description: "Ultra-comfortable premium cotton t-shirt with a modern fit. Made from 100% organic cotton that's breathable and soft on your skin. Perfect for everyday wear and available in multiple colors.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviewCount: 124,
    reviews: [
      { id: 1, author: "Alex Johnson", rating: 5, content: "Great quality and exactly as described. Very comfortable!", date: "3 days ago" },
      { id: 2, author: "Sarah Williams", rating: 4, content: "Good fit and nice material. Shipping was fast too.", date: "1 week ago" },
      { id: 3, author: "Michael Brown", rating: 5, content: "This is my third one. Absolutely love these shirts!", date: "2 weeks ago" },
    ],
    image: "https://placehold.co/600x600/png", // You'll need to add this image to your public folder
  };

  // Calculate savings
  const savings = product.price - product.discountedPrice;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-center object-cover"
                // Use a placeholder image if needed
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x600?text=Product+Image";
                }}
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0 lg:col-start-2">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            
            {/* Rating */}
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                    } h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-700">
                {product.rating} out of 5 stars ({product.reviewCount} reviews)
              </p>
            </div>

            {/* Price and discount */}
            <div className="mt-4">
              <div className="flex items-center">
                <p className="text-2xl font-medium text-gray-900">${product.discountedPrice.toFixed(2)}</p>
                <p className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                <p className="ml-2 text-sm font-medium text-red-600">
                  Save ${savings.toFixed(2)} ({product.discountPercentage}% off)
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <div className="mt-2 text-base text-gray-700 space-y-2">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Select Size</h2>
              <div className="mt-2 grid grid-cols-6 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${
                      selectedSize === size
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300'
                    } bg-white border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart button */}
            <div className="mt-8">
              <button
                type="button"
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="mt-6 space-y-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">{review.author}</p>
                  <div className="ml-4 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={`${
                          review.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                        } h-4 w-4 flex-shrink-0`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-4 text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
