import ProductCard from "./components/product_card";

export default function Home() {
  const products = [
    {
      id: 1,
      title: "Nike Air Max 90",
      price: 120,
      discount: 25,
      rating: 4.6,
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
      title: "Puma Future Rider",
      price: 90,
      discount: 10,
      rating: 4.3,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 4,
      title: "Reebok Classic Leather",
      price: 75,
      discount: 20,
      rating: 4.5,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 5,
      title: "Vans Old Skool",
      price: 65,
      discount: 5,
      rating: 4.7,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 6,
      title: "Converse Chuck Taylor",
      price: 50,
      discount: 10,
      rating: 4.6,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 7,
      title: "New Balance 574",
      price: 110,
      discount: 12,
      rating: 4.4,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 8,
      title: "Under Armour HOVR Phantom",
      price: 140,
      discount: 0,
      rating: 4.2,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 9,
      title: "Asics Gel-Kayano",
      price: 130,
      discount: 18,
      rating: 4.5,
      img: "https://placehold.co/600x400/png",
    },
    {
      id: 10,
      title: "Saucony Triumph 18",
      price: 150,
      discount: 10,
      rating: 4.9,
      img: "https://placehold.co/600x400/png",
    },
  ];
  return (
    <div>
      <div className="container p-12 mx-auto">
        <div className="grid grid-cols-4 gap-x-0.5 gap-y-1">
          {products.map((e) => (
            <ProductCard
              key={e.id}
              title={e.title}
              price={e.price}
              discount={e.discount}
              img={e.img}
              rating={e.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
