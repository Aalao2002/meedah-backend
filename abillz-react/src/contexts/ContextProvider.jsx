import { useState, useCallback, useMemo, createContext } from "react";

export const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  isAdmin: false,
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("USER");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN") || null);

  const setToken = useCallback((token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  }, []);

  const setUserAndStore = useCallback((user) => {
    setUser(user);
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
  }, []);

  const isAdmin = user?.user_role?.toLowerCase() === "admin";

  const value = useMemo(
    () => ({
      user,
      token,
      setUser: setUserAndStore,
      setToken,
      isAdmin,
    }),
    [user, token, setUserAndStore, setToken, isAdmin]
  );

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};