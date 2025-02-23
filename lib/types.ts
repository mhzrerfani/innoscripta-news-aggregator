import { Category, NewsSources } from "./config";

export interface Article {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  category?: string;
}

export interface NewsFilters {
  query?: string;
  category?: Category;
  date?: string;
  page?: number;
  pageSize?: number;
  source?: NewsSources;
}

export interface NewsSource {
  id: string;
  name: string;
  fetchNews: (filters?: NewsFilters) => Promise<{
    articles: Article[];
    hasMore: boolean;
    totalResults: number;
    currentPage?: number;
    totalPages?: number;
  }>;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface NewsApiArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface GuardianApiResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianArticle[];
  };
}

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields: {
    trailText: string;
    thumbnail: string;
  };
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
}

export interface RSSFeed {
  "?xml": {
    "@_version": string;
    "@_encoding": string;
  };
  rss: {
    channel: {
      title: string;
      description: string;
      link: string;
      image: {
        url: string;
        title: string;
        link: string;
      };
      generator: string;
      lastBuildDate: string;
      "atom:link": {
        "@_href": string;
        "@_rel": string;
        "@_type": string;
      };
      copyright: string;
      language: string;
      ttl: number;
      item: BBCRssItem[];
    };
    "@_xmlns:dc": string;
    "@_xmlns:content": string;
    "@_xmlns:atom": string;
    "@_version": string;
    "@_xmlns:media": string;
  };
}
export interface BBCRssItem {
  title: string;
  description: string;
  link: string;
  guid: {
    "#text": string;
    "@_isPermaLink": string;
  };
  pubDate: string;
  "media:thumbnail": {
    "@_width": string;
    "@_height": string;
    "@_url": string;
  };
}
