"use client";

import { useRef} from "react";
import Link from "next/link";

import { useDisclosure } from "@mantine/hooks";
import {  Crown, Search } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

import { UserActions } from "@/components/layouts/UserActions";

import { Container } from "../ui/container";
import { Input } from "../ui/input";
import { NoticeBell } from "../common/NoticeBell";
import { resolveNotificationLink } from "@/utils/notification";

const Header = () => {
  const [visible, { close, open }] = useDisclosure(true);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(scrollY.get());

  const { isAuthenticated } = useMe();

  const isMobile = useIsMobile();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobile) return;
    const previous = lastScrollY.current;
    if (Math.abs(latest - previous) < 5) return;
    if (latest > previous && visible) close();
    else if (latest < previous && !visible) open();
    lastScrollY.current = latest;
  });

  return (
    <motion.header
      animate={visible ? "visible" : "hidden"}
      initial="visible"
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 w-full bg-white px-5 shadow-[0_1px_8px_rgba(0,0,0,0.1)] transition-all duration-500 lg:px-8"
      )}
    >
      <Container
        className={cn(
          "mx-auto flex h-[72px] items-center justify-between gap-8 px-0 transition-all duration-300 ease-in-out lg:px-4"
        )}
      >
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* SEARCH MOBILE - ĐẸP HƠN */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-600 transition-all duration-200" />
            <Input
              placeholder="Tìm bài viết, tag, tác giả..."
              className={cn(
                "pl-10 pr-4 py-2 h-10 bg-gray-50 border-border rounded-full",
                "focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:border-purple-500",
                "placeholder:text-muted-foreground/70 text-sm",
                "transition-all duration-200",
                "group-focus-within:shadow-md group-focus-within:bg-white"
              )}
            />
          </div>

          <Link
            href={ROUTES.HOME}
            className="flex w-fit items-center space-x-2"
          >
            <Crown className="size-6 text-purple-600" />
            <span className="text-purple-600 text-xl font-bold">CVking</span>
          </Link>
        </div>

        <div className="lg:hidden">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 justify-between">
              <NoticeBell resolveLink={resolveNotificationLink} />
              <UserActions />
            </div>
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button
                className="min-w-[110px] text-purple-600 hover:bg-purple-400 hover:text-purple-800"
                variant="outline"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>

        {/* Logo Desktop */}
        <Link
          href={ROUTES.HOME}
          className="hidden w-fit items-center space-x-2 lg:flex"
        >
          <Crown className="size-6 text-purple-600" />
          <span className="text-purple-600 text-xl font-bold">CVking</span>
        </Link>

        <div className="hidden flex-1 lg:flex justify-center">
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-600 transition-all duration-300" />
            <Input
              placeholder="Tìm kiếm bài viết, tag, tác giả..."
              className={cn(
                "pl-12 pr-5 py-3 h-12 bg-gray-50/80 backdrop-blur-sm border-border rounded-full",
                "focus-visible:ring-0 focus-visible:border-purple-500 focus-visible:bg-white",
                "placeholder:text-muted-foreground/60 text-base font-medium",
                "transition-all duration-300 ease-out",
                "group-focus-within:shadow-lg group-focus-within:scale-[1.02]",
                "hover:bg-gray-100"
              )}
            />
          </div>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:block">
          {!isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href={ROUTES.LOGIN}>
                <Button
                  className="min-w-[110px] text-purple-600 hover:bg-purple-400 hover:text-purple-800"
                  variant="outline"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button className="min-w-[110px] bg-purple-600 hover:bg-purple-400">
                  Đăng ký
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 justify-between">
              <NoticeBell resolveLink={resolveNotificationLink} />
              <UserActions />
            </div>
          )}
        </div>
      </Container>
    </motion.header>
  );
};

export default Header;
