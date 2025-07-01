import EditCategoryView from "@/views/dashboard/edit-category";

export default function AddCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditCategoryView editCategoryId={params.id} />;
}
