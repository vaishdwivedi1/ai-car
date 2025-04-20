export const isLoggedIn = () => {
  if (typeof window === "undefined") return false; // Prevent SSR crash
  const isToken = window.localStorage.getItem("token");
  return isToken;
};
