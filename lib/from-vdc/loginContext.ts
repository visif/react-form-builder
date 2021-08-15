import React from "react";

const getLoginSession = (): UserLoginContext => {
  const sessionCookie = localStorage.getItem("auth") || "{}";
  return JSON.parse(sessionCookie) as UserLoginContext;
};

export const saveLoginSession = (user: UserLoginContext | null): void => {
  if (user === null) {
    localStorage.setItem("auth", "{}");
    return;
  }
  localStorage.setItem("auth", JSON.stringify(user));
};

export interface UserLoginContext {
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
  userId: number;
  departmentId: number;
};

export const initialAuthModel = {
  isAuthenticated: false,
  firstName: "",
  lastName: "",
  userId: -1,
  departmentId: -1
};

export const initialLoginContext = {
  auth: getLoginSession(),
  setAuthentication: (userLoginContext: UserLoginContext): void => {
    console.log(userLoginContext);
  }
};

export const LoginContext = React.createContext(initialLoginContext);
