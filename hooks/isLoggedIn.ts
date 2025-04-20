export const isLoggedIn = () => {
  const isToken = localStorage.getItem("token");
  return isToken;
};


