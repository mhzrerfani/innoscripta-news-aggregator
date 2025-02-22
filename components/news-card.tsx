/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

interface Article {
  title: string
  description: string
  url: string
  imageUrl: string
  source: string
  publishedAt: string
}

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={article.imageUrl || "/placeholder.svg?height=192&width=384"}
          alt={article.title} className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <Badge variant="secondary">{article.source}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {new Date(article.publishedAt).toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{article.description}</p>
      </CardContent>
    </Card>
  )
}

