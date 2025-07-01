import { api, endpoints, fetcher } from "@/lib/axios"
import { useMemo } from "react";
import useSWR from "swr";

export function useGetProducts(params?: { categoryId?: string; }) {
    const { categoryId } = params || {};
    const productEndpoint = endpoints.product;

    const URL = categoryId ? `${productEndpoint}?categoryId=${categoryId}` : productEndpoint;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            products: data?.data || [],
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetProduct(params?: { id?: string; slug?: string }) {
    const { id, slug } = params || {};
    
    // Use the new API endpoint format
    const URL = slug ? `/api/products/${slug}` : id ? `/api/products/${id}` : null;

    const { data, isLoading, error, isValidating } = useSWR(
        URL,
        fetcher
    );

    const memoizedValue = useMemo(
        () => ({
            product: data || null,
            productLoading: isLoading,
            productError: error,
            productValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetProductsByCategorySlug(categorySlug: string) {
    const productEndpoint = endpoints.product;

    const URL = `${productEndpoint}?categorySlug=${categorySlug}`;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            products: data?.data || [],
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetProductsBySearch(query: string) {
    const productEndpoint = endpoints.product;

    const URL = query ? `${productEndpoint}?search=${encodeURIComponent(query)}` : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            products: data?.data || [],
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
