"use client";

import { useParams } from "next/navigation";

function ProductDetailPage() {
  const { id } = useParams();

  return <h1>Product: {id}</h1>;
}

export default ProductDetailPage;
