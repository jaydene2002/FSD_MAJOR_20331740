"use client";

import { createContext, useContext } from "react";

const UserContext = createContext<string | undefined>(undefined);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  userIp,
  children,
}: {
  userIp: string;
  children: React.ReactNode;
}) => (
  <UserContext.Provider value={userIp}>{children}</UserContext.Provider>
);
