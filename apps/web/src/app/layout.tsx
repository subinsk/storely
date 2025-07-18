import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { API_URL } from "../config";
import { headers } from "next/headers";
import RootLayout from "../layouts/root-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Furnerio - Premium Furniture Store",
  description: "Discover premium furniture for modern living spaces. Shop our curated collection of sofas, chairs, tables, and more.",
  keywords: "furniture, home decor, modern furniture, living room, bedroom, dining room",
};

async function getCategories() {
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/category`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Failed to fetch categories");
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  const headersList = headers();
  const organizationId = headersList.get('x-organization-id');

  return (
    <html lang="en">
      <head>
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <RootLayout categories={categories} organizationId={organizationId || undefined}>
          {children}
        </RootLayout>
      </body>
    </html>
  );
}
