import { createContext, useContext, useState } from "react";
import {
  verifyCredentials,
  generateToken,
  decodeToken,
  refreshAccessToken,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    return decodeToken(token);
  });

  const login = (email, password) => {
    const validUser = verifyCredentials(email, password);

    if (!validUser) {
      return false;
    }

    const token = generateToken(validUser);

    localStorage.setItem("token", token);
    localStorage.setItem("role", validUser.role);
    localStorage.setItem("name", validUser.name);
    localStorage.setItem("email", validUser.email);

    setUser({
      id: validUser.id,
      name: validUser.name,
      email: validUser.email,
      role: validUser.role,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setUser(null);
  };

  const refreshToken = () => {
    const oldToken = localStorage.getItem("token");

    if (!oldToken) {
      return false;
    }

    const newToken = refreshAccessToken(oldToken);

    if (!newToken) {
      logout();
      return false;
    }

    localStorage.setItem("token", newToken);

    const updatedUser = decodeToken(newToken);

    if (updatedUser) {
      setUser(updatedUser);
      return true;
    }

    logout();
    return false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (permission) => {
    const permissions = {
      Admin: ["create", "edit", "delete", "read"],
      Editor: ["create", "edit", "read"],
      Viewer: ["read"],
    };

    return user
      ? permissions[user.role]?.includes(permission)
      : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        hasRole,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}