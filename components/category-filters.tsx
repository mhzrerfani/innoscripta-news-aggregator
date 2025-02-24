"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { Category } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CategoryFiltersProps = {
  displayMode: "list" | "select";
  className?: string;
};

export const availableCategories: Array<{ name: Category; icon: LucideIcon }> =
  [
    { name: "general", icon: Newspaper },
    { name: "business", icon: Briefcase },
    { name: "culture", icon: Film },
    { name: "wellness", icon: Heart },
    { name: "science", icon: Flask },
    { name: "sport", icon: Football },
    { name: "technology", icon: Cpu },
    { name: "world", icon: Globe },
  ] as const;

function CategoryFiltersSection({
  displayMode,
  className,
}: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentCategory = searchParams.get("category");

  const handleCategoryChange = (category: Category) => {
    const params = new URLSearchParams(searchParams);

    if (
      category === currentCategory ||
      (category === "general" && !currentCategory)
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
    <div className={cn("w-full whitespace-nowrap", className)}>
      {displayMode === "list" ? (
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
      ) : (
        <Select
          onValueChange={handleCategoryChange}
          defaultValue={currentCategory || "general"}
        >
          <SelectTrigger className="w-full">
            <span className="capitalize pr-2">
              {currentCategory || "general"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                <div className="flex items-center gap-2 py-1">
                  <category.icon className="h-4 w-4 mr-1" />
                  <span className="capitalize">{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export default function CategoryFilters({
  displayMode,
  className,
}: CategoryFiltersProps) {
  return (
    <Suspense>
      <CategoryFiltersSection displayMode={displayMode} className={className} />
    </Suspense>
  );
}
