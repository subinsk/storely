import EditProductView from "@/views/dashboard/edit-product";

export default function AddCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditProductView editProductId={params.id} />;
}
