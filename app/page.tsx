import Link from "next/link";
import ProductCard from "./components/product_card";
import Carousel from "./components/ui/carousel";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      title: "Nike Air Max 270",
      price: 150,
      discount: 10,
      rating: 4.5,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 2,
      title: "Adidas Ultraboost 21",
      price: 180,
      discount: 15,
      rating: 4.8,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 3,
      title: "Puma RS-X Toys",
      price: 120,
      rating: 4.2,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 4,
      title: "New Balance 990v5",
      price: 185,
      discount: 5,
      rating: 4.7,
      img: "https://placehold.co/600x400/png",
    },
  ];
  return (
    <main className="min-h-screen">
      {/* Hero Carousel */}

      <section className="container mx-auto px-4 py-8">
        <Carousel />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our selection of top-rated and best-selling products that
            customers love
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              discount={product.discount || 0}
              img={product.img}
              rating={product.rating}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/product"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="lg:flex items-center gap-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src="https://placehold.co/800x600/E5E7EB/1F2937?text=Our+Story"
                alt="About Our Company"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <div className="w-20 h-1 bg-blue-600 mb-6"></div>

            <p className="text-gray-700 mb-4">
              Welcome to our store, where passion meets quality. Founded in
              2010, we&apos;ve been dedicated to providing our customers with
              the best selection of products at competitive prices.
            </p>

            <p className="text-gray-700 mb-4">
              Our mission is simple: to deliver exceptional products and
              outstanding customer service. We carefully select each item in our
              inventory to ensure it meets our high standards of quality and
              value.
            </p>

            <p className="text-gray-700 mb-6">
              With over a decade of experience in the industry, we&apos;ve built
              strong relationships with top manufacturers and brands, allowing
              us to offer you exclusive deals and the latest products as soon as
              they hit the market.
            </p>

            <Link
              href="/about"
              className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-600 hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and be the first to know about new
            products, special offers, and exclusive promotions.
          </p>

          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-md flex-grow text-gray-800 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
