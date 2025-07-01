import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function useAuthContext() {
  const { data: session, status } = useSession();

  const user = useMemo(() => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      displayName: session.user.name || '',
      email: session.user.email || '',
      photoURL: session.user.image || null,
      role: session.user.role || 'member',
      organizationId: session.user.organizationId,
      // Add additional fields that the UI expects
      phoneNumber: '',
      country: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      about: '',
      isPublic: true,
    };
  }, [session]);

  const memoizedValue = useMemo(
    () => ({
      user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [user, status]
  );

  return memoizedValue;
}
