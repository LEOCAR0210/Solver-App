import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, MessageCircle } from "lucide-react"

export interface Expert {
  id: number
  name: string
  role: string
  avatar: string
  opinion: string
}

interface ExpertOpinionsProps {
  experts: Expert[]
  title?: string
}

export default function ExpertOpinions({ experts, title = "Opiniones de expertos" }: ExpertOpinionsProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experts.map((expert) => (
          <Card key={expert.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={expert.avatar} alt={expert.name} />
                  <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{expert.name}</CardTitle>
                  <CardDescription>{expert.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>{expert.opinion}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

