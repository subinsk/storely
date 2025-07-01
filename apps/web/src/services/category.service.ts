"use client";

import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetCategories(params?: { id?: string; slug?: string }) {
  const { id, slug } = params || {};
  const categoryEndpoint = endpoints.category;

  const URL = id ? `${categoryEndpoint}?id=${id}` : slug ? `${categoryEndpoint}?slug=${slug}` : categoryEndpoint;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const res = await api.get(url);
    return res.data;
  });


  const categories = useMemo(() => {
    if (slug || id) {
      return data?.data?.subCategories;
    } else {
      return data?.data;
    }
  }, [data, slug, id]);

  const memoizedValue = useMemo(
    () => ({
      categoryDetails: data?.data,
      categories: categories || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !categories.length,
    }),
    [categories, data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const addCategory = async (payload: any) => {
  const res = await api.post("/category", payload);
  console.log("res:", res);
  return res.data;
};
