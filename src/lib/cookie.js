import Cookies from "js-cookie";

// Set a cookie
export const setCookie = (key, value, expiryInDays) => {
  Cookies.set(key, JSON.stringify(value), { expires: expiryInDays, secure: true, sameSite: 'strict' });
};

// Get a cookie
export const getCookie = (key) => {
  const cookie = Cookies.get(key);
  return cookie ? JSON.parse(cookie) : null;
};

// Remove a cookie
export const removeCookie = (key) => {
  Cookies.remove(key, { secure: true, sameSite: 'strict' });
};
