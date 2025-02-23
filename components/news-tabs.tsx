"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsGrid from "./news-grid";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { NewsSources } from "@/lib/types";

function NewsTabsSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSource = searchParams.get("source") || "all";

  const allSources: {
    id: NewsSources;
    label: string;
  }[] = [
    { id: "all", label: "All Sources" },
    { id: "guardian", label: "The Guardian" },
    { id: "bbc", label: "BBC News" },
    { id: "newsapi", label: "NewsAPI" },
  ];

  if (!allSources.find((source) => source.id === currentSource)) {
    const params = new URLSearchParams(searchParams);
    params.set("source", "all");
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("source", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (allSources.length <= 1) return null;

  return (
    <Tabs
      defaultValue={currentSource}
      onValueChange={handleTabChange}
      className="mb-6"
    >
      <TabsList>
        {allSources.map((source) => (
          <TabsTrigger key={source.id} value={source.id}>
            {source.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {allSources.map((source) => (
        <TabsContent key={source.id} value={source.id}>
          <NewsGrid source={source.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function NewsTabs() {
  return (
    <Suspense>
      <NewsTabsSection />
    </Suspense>
  );
}
