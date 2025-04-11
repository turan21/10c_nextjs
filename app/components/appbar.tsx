"use client";
import React, { useState } from "react";
import { Star, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

// Type definition for navigation items
interface NavItem {
  label: string;
  categories: string[];
}

const AppBar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const navItems: NavItem[] = [
    {
      label: "Новинки",
      categories: ["Одежда", "Обувь", "Аксессуары"],
    },
    {
      label: "Бренды",
      categories: ["Nike", "Adidas", "Puma", "Zara", "H&M"],
    },
    {
      label: "Мужское",
      categories: ["Куртки", "Футболки", "Джинсы", "Обувь", "Аксессуары"],
    },
    {
      label: "Женское",
      categories: ["Платья", "Блузки", "Юбки", "Обувь", "Сумки"],
    },
    {
      label: "Аксессуары",
      categories: ["Сумки", "Часы", "Ремни", "Шапки", "Очки"],
    },
    {
      label: "Скидки",
      categories: ["Распродажа", "Сезонные скидки", "Специальные предложения"],
    },
  ];

  const handleMouseEnter = (index: number) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav
      className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200"
      onMouseLeave={handleMouseLeave}
    >
      {/* Brand Logo */}
      <Link href={"/"}>
        <div className="text-2xl font-bold uppercase">brands shop</div>
      </Link>

      {/* Navigation Menu */}
      <div className="flex space-x-6 text-sm text-gray-700">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <a href="#" className="hover:text-black">
              {item.label}
            </a>
            {activeDropdown === index && (
              <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                <div className="py-2">
                  {item.categories.map((category, catIndex) => (
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      key={catIndex}
                      href={`/`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-black">
          <Star size={20} />
        </button>
        <button className="text-gray-600 hover:text-black">
          <Link href="/product">
            <Search size={20} />
          </Link>
        </button>
        <Link href="/cart" className="text-gray-600 hover:text-black">
          <ShoppingBag size={20} />
        </Link>
        <button className="text-gray-600 hover:text-black">
          <Link href="/users">
            <User size={20} />
          </Link>
        </button>
      </div>
    </nav>
  );
};

export default AppBar;
