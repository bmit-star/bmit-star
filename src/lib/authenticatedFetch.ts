import { auth } from './firebase';

export const authenticatedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Админаар нэвтрээгүй байна.');
  }

  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(input, { ...init, headers });
};
