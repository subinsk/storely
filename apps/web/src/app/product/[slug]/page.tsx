import ProductView from "@/views/product";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return <ProductView slug={slug} />;
}
