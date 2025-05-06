import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StartupCard from "@/components/startup-card"
import Pagination from "@/components/pagination"
import { getStartups, getIndustries, getTeamSizes, getBusinessModels } from "@/lib/data"

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    industry?: string
    search?: string
    teamSize?: string
    businessModel?: string
  }
}) {
  const page = Number(searchParams.page) || 1
  const industry = searchParams.industry || ""
  const search = searchParams.search || ""
  const teamSize = searchParams.teamSize || ""
  const businessModel = searchParams.businessModel || ""

  const startups = await getStartups({
    page,
    industry,
    search,
    teamSize,
    businessModel,
  })

  const industries = await getIndustries()
  const teamSizes = await getTeamSizes()
  const businessModels = await getBusinessModels()

  const totalPages = Math.ceil(startups.length / 12) // Assuming 12 per page

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Startup Directory</h1>

      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search startups..." className="pl-8" defaultValue={search} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select defaultValue={industry}>
            <SelectTrigger>
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue={teamSize}>
            <SelectTrigger>
              <SelectValue placeholder="All Team Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Sizes</SelectItem>
              {teamSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue={businessModel}>
            <SelectTrigger>
              <SelectValue placeholder="All Business Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Business Models</SelectItem>
              {businessModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {startups.slice((page - 1) * 12, page * 12).map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
