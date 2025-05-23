import { createContext, useContext } from "react";

const UserContext = createContext({ user: { level: "DEF" } });

export const useUser = () => useContext(UserContext);
export const UserProvider = UserContext.Provider;
