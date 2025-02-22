import {
  Newspaper,
  Briefcase,
  Film,
  Heart,
  FlaskRoundIcon as Flask,
  ClubIcon as Football,
  Cpu,
  Globe,
} from "lucide-react"

export const availableSources = [
  { id: "reuters", name: "Reuters", icon: Newspaper },
  { id: "bloomberg", name: "Bloomberg", icon: Briefcase },
  { id: "business-insider", name: "Business Insider", icon: Briefcase },
  { id: "techcrunch", name: "TechCrunch", icon: Cpu },
  { id: "the-verge", name: "The Verge", icon: Cpu },
  { id: "wired", name: "Wired", icon: Cpu },
  { id: "cnn", name: "CNN", icon: Newspaper },
  { id: "bbc-news", name: "BBC News", icon: Newspaper },
  { id: "associated-press", name: "Associated Press", icon: Newspaper },
  { id: "the-guardian", name: "The Guardian", icon: Newspaper },
  { id: "the-washington-post", name: "Washington Post", icon: Newspaper },
  { id: "wall-street-journal", name: "Wall Street Journal", icon: Newspaper },
] as const

export const availableCategories = [
  { name: "General", icon: Newspaper },
  { name: "Business", icon: Briefcase },
  { name: "Entertainment", icon: Film },
  { name: "Health", icon: Heart },
  { name: "Science", icon: Flask },
  { name: "Sports", icon: Football },
  { name: "Technology", icon: Cpu },
  { name: "World", icon: Globe },
] as const

