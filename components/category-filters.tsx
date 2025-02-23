"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import {
  Newspaper,
  Briefcase,
  Film,
  Heart,
  FlaskRoundIcon as Flask,
  ClubIcon as Football,
  Cpu,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Category } from "@/lib/config";

export const availableCategories: Array<{ name: Category, icon: LucideIcon }> = [
  { name: "general", icon: Newspaper },
  { name: "business", icon: Briefcase },
  { name: "culture", icon: Film },
  { name: "wellness", icon: Heart },
  { name: "science", icon: Flask },
  { name: "sport", icon: Football },
  { name: "technology", icon: Cpu },
  { name: "world", icon: Globe },
] as const;


function CategoryFiltersSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentCategory = searchParams.get("category");

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);

    if (
      category === currentCategory ||
      (category === "General" && !currentCategory)
    ) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    queryClient.invalidateQueries({ queryKey: ["news"] });
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex flex-wrap gap-2 pb-2">
        {availableCategories.map((category) => (
          <Button
            key={category.name}
            variant={
              currentCategory === category.name ||
                (!currentCategory && category.name === "general")
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => handleCategoryChange(category.name)}
            className="min-w-[80px]"
          >
            <category.icon className="h-4 w-4 mr-1" />
            <span className="capitalize">{category.name}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default function CategoryFilters() {
  return (
    <Suspense>
      <CategoryFiltersSection />
    </Suspense>
  );
}
