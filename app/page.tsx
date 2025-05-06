import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StartupCard from "@/components/startup-card"
import { getStartups, getIndustries } from "@/lib/data"

export default async function Home() {
  const startups = await getStartups()
  const industries = await getIndustries()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Thai Startup Directory</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Discover and connect with innovative startups across Thailand
        </p>
        <div className="flex max-w-md mx-auto gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search startups..." className="pl-8" />
          </div>
          <Button asChild>
            <Link href="/register">Register Your Startup</Link>
          </Button>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Startups</h2>
          <Button variant="outline" asChild>
            <Link href="/directory">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.slice(0, 6).map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Are you a Thai startup?</h2>
          <p className="text-muted-foreground mb-6">
            Join our directory to increase your visibility and connect with investors, partners, and customers.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Browse by Industry</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.slice(0, 12).map((industry) => (
            <Link
              key={industry}
              href={`/directory?industry=${industry}`}
              className="bg-muted hover:bg-muted/80 transition-colors rounded-lg p-4 text-center"
            >
              {industry}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
