import { useMemo } from 'react';
import useSWR from 'swr';
import { useOrganization } from '../contexts/OrganizationContext';
import { EmailTemplate, EmailTemplateType } from '../types/email';

export function useEmailTemplates(type?: EmailTemplateType) {
  const { organization } = useOrganization();
  
  const queryParams = new URLSearchParams();
  if (type) queryParams.set('type', type);
  
  const URL = organization?.id ? `/api/email-templates?${queryParams.toString()}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch email templates');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      templates: data?.data || [],
      templatesLoading: isLoading,
      templatesError: error,
      templatesValidating: isValidating,
      mutateTemplates: mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useEmailTemplate(id: string) {
  const { organization } = useOrganization();
  
  const URL = organization?.id && id ? `/api/email-templates/${id}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch email template');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      template: data?.data || null,
      templateLoading: isLoading,
      templateError: error,
      templateValidating: isValidating,
      mutateTemplate: mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export async function createEmailTemplate(template: Partial<EmailTemplate>) {
  const response = await fetch('/api/email-templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to create email template');
  }

  return response.json();
}

export async function updateEmailTemplate(id: string, template: Partial<EmailTemplate>) {
  const response = await fetch(`/api/email-templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to update email template');
  }

  return response.json();
}

export async function deleteEmailTemplate(id: string) {
  const response = await fetch(`/api/email-templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete email template');
  }

  return response.json();
}
