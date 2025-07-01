import CategoriesView from "@/views/dashboard/categories";

export default function Page({ params }: { params: { slug?: string[] } }) {
  // variables
  const { slug } = params;

  return (
    <CategoriesView categorySlug={slug ? slug[slug.length - 1] : undefined} />
  );
}
