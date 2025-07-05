import useSWR from 'swr';
import { fetcher } from '@storely/shared/lib/axios';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  order: {
    id: string;
    orderNumber: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  orderId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export const useGetInvoices = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);

  const { data, error, isLoading, mutate } = useSWR<{
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/invoices?${query.toString()}`, fetcher);

  return {
    invoices: data?.invoices || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
};

export const useGetInvoice = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<{ invoice: Invoice }>(
    id ? `/api/invoices/${id}` : null,
    fetcher
  );

  return {
    invoice: data?.invoice,
    isLoading,
    error,
    mutate,
  };
};

export const createInvoice = async (data: InvoiceFormData): Promise<Invoice> => {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create invoice');
  }

  const result = await response.json();
  return result.invoice;
};

export const updateInvoice = async (id: string, data: Partial<InvoiceFormData>): Promise<Invoice> => {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update invoice');
  }

  const result = await response.json();
  return result.invoice;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }
};

export const sendInvoice = async (id: string, email?: string): Promise<void> => {
  const response = await fetch(`/api/invoices/${id}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send invoice');
  }
};

export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const response = await fetch(`/api/invoices/${id}/pdf`);

  if (!response.ok) {
    throw new Error('Failed to download invoice PDF');
  }

  return response.blob();
};

export const getInvoicePreview = async (id: string): Promise<string> => {
  const response = await fetch(`/api/invoices/${id}/preview`);

  if (!response.ok) {
    throw new Error('Failed to get invoice preview');
  }

  const result = await response.json();
  return result.html;
};
