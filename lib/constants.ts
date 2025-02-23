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

export const availableCategories = [
  { name: "General", icon: Newspaper },
  { name: "Business", icon: Briefcase },
  { name: "Culture", icon: Film },
  { name: "Wellness", icon: Heart },
  { name: "Science", icon: Flask },
  { name: "Sport", icon: Football },
  { name: "Technology", icon: Cpu },
  { name: "World", icon: Globe },
] as const

