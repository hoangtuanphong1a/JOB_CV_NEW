import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { BgGradient } from "@/components/common/bg-gradient";

import { LoginForm } from "./components/LoginForm";
import { Crown } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 font-medium text-2xl text-purple-400"
          >
            <Crown className="size-6 text-purple-600" />
            <span className="text-purple-600 text-xl font-bold">CVking</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <BgGradient />
        <Image
          src="/images/bg.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
