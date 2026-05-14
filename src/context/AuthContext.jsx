import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import * as authApi from "../api/authApi";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* ================= LOAD USER ================= */

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem(
          "user"
        );

      const savedToken =
        localStorage.getItem(
          "token"
        );

      if (
        savedUser &&
        savedToken
      ) {

        const parsedUser =
          JSON.parse(savedUser);

        setUser({
          ...parsedUser,
          token: savedToken,
        });

      }

    } catch (error) {

      console.log(
        "Auth Load Error:",
        error
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );
    }

    setAuthLoading(false);

  }, []);

  /* ================= LOGIN ================= */

  const login = async (
    email,
    password
  ) => {

    const data =
      await authApi.login(
        email,
        password
      );

    const userData = {
      ...data.user,
      token: data.token,
    };

    /* SAVE USER */

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    /* SAVE TOKEN */

    localStorage.setItem(
      "token",
      data.token
    );

    setUser(userData);

    return userData;
  };

  /* ================= REGISTER ================= */

  const register = async (
    name,
    email,
    password,
    role
  ) => {

    return await authApi.register(
      name,
      email,
      password,
      role
    );
  };

  /* ================= LOGOUT ================= */

  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        authLoading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);