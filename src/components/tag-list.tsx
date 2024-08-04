"use client";

import { useRouter } from "next/navigation";
import { badgeVariants } from "./ui/badge";
import { cn } from "@/lib/utils";

export function TagsList({ lang }: { lang: string[] }) {
  const router = useRouter();
  return (
    <div className="flex gap-2 flex-wrap">
      {lang.map((lang) => (
        <button
          className={cn(badgeVariants())}
          key={lang}
          onClick={() => {
            router.push(`/?search=${lang}`);
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}