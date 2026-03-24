import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "hr" | "job-seeker" | "employer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string; // For employer/hr
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, role: UserRole) => {
    // TODO: Replace with actual API call
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data based on role
    const mockUsers: Record<UserRole, User> = {
      admin: {
        id: "1",
        name: "Admin User",
        email: email,
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
      hr: {
        id: "2",
        name: "HR Manager",
        email: email,
        role: "hr",
        companyName: "TechViet Solutions",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hr",
      },
      "job-seeker": {
        id: "3",
        name: "Nguyễn Văn A",
        email: email,
        role: "job-seeker",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jobseeker",
      },
      employer: {
        id: "4",
        name: "Employer User",
        email: email,
        role: "employer",
        companyName: "ABC Company",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=employer",
      },
    };

    const userData = mockUsers[role];
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loginWithGoogle = async (role: UserRole) => {
    // TODO: Replace with actual Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userData: User = {
      id: Date.now().toString(),
      name: "Google User",
      email: "user@gmail.com",
      role: role,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
      ...(role === "employer" || role === "hr" ? { companyName: "My Company" } : {}),
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
