import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const mockUsers = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "user@example.com", password: "user123", role: "user" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("wetlandsUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("wetlandsUser", JSON.stringify(found));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wetlandsUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
