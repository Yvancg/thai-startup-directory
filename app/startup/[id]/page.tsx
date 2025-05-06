import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Globe, Mail, Phone, Users, Building, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getStartupById, getStartups } from "@/lib/data"

export default async function StartupPage({ params }: { params: { id: string } }) {
  const startup = await getStartupById(params.id)

  if (!startup) {
    notFound()
  }

  // Get similar startups (same industry)
  const allStartups = await getStartups()
  const similarStartups = allStartups
    .filter(
      (s) =>
        s.id !== startup.id &&
        s.industries &&
        startup.industries &&
        s.industries.toLowerCase().includes(startup.industries.toLowerCase().split(",")[0].trim()),
    )
    .slice(0, 3)

  // Format industries for display
  const industriesList = startup.industries?.split(",").map((i) => i.trim()) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/directory">
              <Button variant="outline" size="sm">
                Back to Directory
              </Button>
            </Link>
            {industriesList.map((industry) => (
              <Badge key={industry}>{industry}</Badge>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
              {startup.logo ? (
                <img
                  src={startup.logo || "/placeholder.svg"}
                  alt={`${startup.companyName} logo`}
                  className="object-contain max-h-full max-w-full p-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center text-3xl font-bold">
                  {startup.companyName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{startup.companyName}</h1>
              {startup.legalName && <p className="text-muted-foreground mb-2">Legal name: {startup.legalName}</p>}
              <div className="flex items-center text-muted-foreground mb-4">
                <Globe className="h-4 w-4 mr-2" />
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {startup.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {startup.foundedDate && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Founded {startup.foundedDate}</span>
                  </div>
                )}
                {startup.teamSize && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{startup.teamSize}</span>
                  </div>
                )}
                {startup.businessModelType && (
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{startup.businessModelType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom fields would be displayed here */}
          {startup.customFields && Object.keys(startup.customFields).length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(startup.customFields).map(([key, value]) => (
                  <div key={key} className="flex items-center text-muted-foreground">
                    <span className="font-medium mr-2">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startup.user1Name && (
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium">{startup.user1Name}</h3>
                  {startup.user1Position && <p className="text-sm text-muted-foreground">{startup.user1Position}</p>}
                  {startup.user1Email && (
                    <a href={`mailto:${startup.user1Email}`} className="text-sm hover:underline flex items-center mt-2">
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      {startup.user1Email}
                    </a>
                  )}
                </div>
              )}

              {startup.user2Name && (
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium">{startup.user2Name}</h3>
                  {startup.user2Position && <p className="text-sm text-muted-foreground">{startup.user2Position}</p>}
                  {startup.user2Email && (
                    <a href={`mailto:${startup.user2Email}`} className="text-sm hover:underline flex items-center mt-2">
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      {startup.user2Email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startup.email && (
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${startup.email}`} className="hover:underline">
                    {startup.email}
                  </a>
                </div>
              )}

              {startup.phoneNumber && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${startup.phoneNumber}`} className="hover:underline">
                    {startup.phoneNumber}
                  </a>
                </div>
              )}

              {startup.socialMedia && (
                <div className="flex items-center text-muted-foreground">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <a href={startup.socialMedia} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Social Media
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <a href={startup.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
              {startup.email && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={`mailto:${startup.email}`}>Contact Startup</a>
                </Button>
              )}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-4">Similar Startups</h3>
            <div className="space-y-4">
              {similarStartups.length > 0 ? (
                similarStartups.map((similar) => (
                  <div key={similar.id} className="group">
                    <Link href={`/startup/${similar.id}`} className="font-medium group-hover:underline">
                      {similar.companyName}
                    </Link>
                    <p className="text-sm text-muted-foreground">{similar.industries?.split(",")[0].trim()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No similar startups found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
