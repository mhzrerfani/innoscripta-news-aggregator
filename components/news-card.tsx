/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Tag, Newspaper } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  category?: string;
}

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Card className="overflow-hidden">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative h-48 w-full">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="object-cover h-full w-full z-20 relative"
          />
          <div className="w-full h-full bg-muted flex items-center justify-center z-10 absolute top-0">
            <Newspaper className="opacity-10 w-10 h-10" />
          </div>
        </div>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary">{article.source}</Badge>
            {article.category && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {article.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })}
          </div>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {article.description}
          </p>
        </CardContent>
      </a>
    </Card>
  );
}
