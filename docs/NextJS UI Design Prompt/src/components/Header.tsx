import { Button } from "./ui/button";
import { Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getNavigationItems, getDefaultDashboard } from "../utils/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navItems = getNavigationItems(user?.role || null);

  const handleNavigate = (route: string) => {
    window.navigateTo(route as any);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.navigateTo("home");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavigate("home")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f26b38] to-[#e05a27]">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl">CVKing</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.route}
                onClick={() => handleNavigate(item.route)}
                className="text-sm transition-colors hover:text-[#f26b38]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigate("login")}
                >
                  Đăng nhập
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#f26b38] hover:bg-[#e05a27]"
                  onClick={() => handleNavigate("register")}
                >
                  Đăng ký
                </Button>
                {/* Show "Post Job" button for non-authenticated users */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50"
                  onClick={() => handleNavigate("login")}
                >
                  Đăng tin tuyển dụng
                </Button>
              </>
            ) : (
              <>
                {/* Show Post Job for employer/hr */}
                {(user?.role === "employer" || user?.role === "hr") && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50"
                    onClick={() => handleNavigate("post-job")}
                  >
                    Đăng tin tuyển dụng
                  </Button>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs text-gray-500">{user?.email}</span>
                        <span className="text-xs text-[#f26b38] mt-1 capitalize">
                          {user?.role === "job-seeker" ? "Ứng viên" : 
                           user?.role === "employer" ? "Nhà tuyển dụng" :
                           user?.role === "hr" ? "HR Manager" : "Admin"}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigate(getDefaultDashboard(user?.role!))}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate("profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleNavigate(item.route)}
                  className="text-sm transition-colors hover:text-[#f26b38] text-left"
                >
                  {item.label}
                </button>
              ))}
              
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigate("login")}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-[#f26b38] hover:bg-[#e05a27]"
                    onClick={() => handleNavigate("register")}
                  >
                    Đăng ký
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50"
                    onClick={() => handleNavigate("login")}
                  >
                    Đăng tin tuyển dụng
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <div className="px-3 py-2">
                    <div className="text-sm">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigate("profile")}
                  >
                    Hồ sơ cá nhân
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Đăng xuất
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
