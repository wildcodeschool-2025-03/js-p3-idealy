export const authFetch = (input: RequestInfo, init: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(init.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };
  return fetch(input, { ...init, headers });
};
