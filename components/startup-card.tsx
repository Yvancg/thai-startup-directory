import Link from "next/link"
import { ExternalLink, Users, Building } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Startup } from "@/lib/types"

interface StartupCardProps {
  startup: Startup
}

export default function StartupCard({ startup }: StartupCardProps) {
  // Extract the first industry for the badge
  const primaryIndustry = startup.industries?.split(",")[0].trim() || "Other"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="h-40 bg-muted flex items-center justify-center relative">
          {startup.logo ? (
            <img
              src={startup.logo || "/placeholder.svg"}
              alt={`${startup.companyName} logo`}
              className="object-contain max-h-full max-w-full p-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center text-3xl font-bold">
              {startup.companyName.charAt(0)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{startup.companyName}</h3>
          <Badge variant="outline">{primaryIndustry}</Badge>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          {startup.teamSize && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>{startup.teamSize}</span>
            </div>
          )}

          {startup.businessModelType && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="h-3.5 w-3.5 mr-1.5" />
              <span>{startup.businessModelType}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/startup/${startup.id}`}>View Details</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href={startup.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            Website
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
