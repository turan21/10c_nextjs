// app/cart/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowLeft } from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  discount: number;
  rating: number;
  img: string;
  quantity: number;
  size?: string;
  color?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 2,
      title: "Adidas Ultraboost 21",
      price: 180,
      discount: 15,
      rating: 4.8,
      img: "https://placehold.co/600x400/png",
      quantity: 1,
      size: "M",
      color: "Black",
    },
  ]);
  
  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getItemDescription = (item: CartItem) => {
    let description = item.title;
    if (item.color || item.size) {
      description += " - ";
      if (item.color) description += item.color;
      if (item.color && item.size) description += ", ";
      if (item.size) description += "S " + item.size;
    }
    return description;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-600">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Add some items to your cart to see them here.</p>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          <div className="lg:col-span-3">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 w-1/6">Product Image</th>
                  <th className="text-left py-3 px-4 w-2/6">Product Title</th>
                  <th className="text-left py-3 px-4 w-1/6">Price</th>
                  <th className="text-left py-3 px-4 w-1/6">Quantity</th>
                  <th className="text-left py-3 px-4 w-1/6">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-4 relative">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute top-4 left-4 bg-white rounded-full p-1 shadow-sm"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                        <div className="h-24 w-24 relative">
                          <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          {getItemDescription(item)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => 
                            updateQuantity(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 p-2 border rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-4">
                        ${itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="p-2 border border-r-0 rounded-l focus:outline-none"
                />
                <button className="bg-gray-800 text-white px-4 py-2 rounded-r">
                  Apply
                </button>
              </div>
              
              <button className="bg-gray-800 text-white px-4 py-2 rounded ml-auto">
                Update Cart
              </button>
            </div>
            
            <div className="mt-8">
              <Link href="/shop" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" />
                Return To Shop
              </Link>
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 p-6 rounded">
              <h2 className="text-lg font-medium mb-4">Order Details</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Cart totals</h3>
                <div className="border-t border-b py-3">
                  <div className="flex justify-between py-1">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Total</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}