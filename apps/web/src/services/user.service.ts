"use client";

import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export const useGetUserProfile = (id: string) => {
    const userEndpoint = `${endpoints.user}/${id}`;
    
    const { data, isLoading, error, isValidating } = useSWR(id ? userEndpoint: null, async (url) => {
        const res = await api.get(url);
        return res.data;
    });
    
    const memoizedValue = useMemo(
        () => ({
        user: data?.data,
        userLoading: isLoading,
        userError: error,
        userValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );
    
    return memoizedValue;
}

export const updateUserProfile = async (payload: any) => {
    const userEndpoint = `${endpoints.user}/${payload.id}`;
    const res = await api.put(userEndpoint, payload);
    return res.data;
};

// address
export const createAddress = async (payload: any) => {
    const res = await api.post(endpoints.address, payload);
    return res.data;
}

export const useGetAddresses = (params?:{
    id?: string;
    userId?: string;
}) => {
    const { id, userId } = params || {};
    
    const addressEndpoint = id ? `${endpoints.address}/${id}` : userId ? `${endpoints.address}?userId=${userId}` : endpoints.address;
    
    const { data, isLoading, error, isValidating, mutate } = useSWR((id || userId) ? addressEndpoint: null, async (url) => {
        const res = await api.get(url);
        return res.data;
    });
    
    const memoizedValue = useMemo(
        () => ({
        addresses: data?.data || [],
        addressesLoading: isLoading,
        addressesError: error,
        addressesValidating: isValidating,
        mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );
    
    return memoizedValue;
}

export const getAddress = async (id: string) => {
    const addressEndpoint = `${endpoints.address}/${id}`;
    const res = await api.get(addressEndpoint);
    return res.data;
}

export const updateAddress = async (payload: any, options?: any) => {
    const item = options?.item;

    const addressEndpoint = item ? `${endpoints.address}/${payload.id}?item=${item}` : `${endpoints.address}/${payload.id}`;
    const res = await api.put(addressEndpoint, payload);
    return res.data;
}

export const deleteAddress = async (id: string) => {
    const addressEndpoint = `${endpoints.address}/${id}`;
    const res = await api.delete(addressEndpoint);
    return res.data;
}