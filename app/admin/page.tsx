import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStartups, getPendingStartups, getCustomFields, getIndustries } from "@/lib/data"
import CustomFieldsManager from "@/components/custom-fields-manager"

export default async function AdminPage() {
  const startups = await getStartups()
  const pendingStartups = await getPendingStartups()
  const customFields = await getCustomFields()
  const industries = await getIndustries()

  // Count startups by industry
  const industryCount: Record<string, number> = {}
  startups.forEach((startup) => {
    if (startup.industries) {
      const industries = startup.industries.split(",").map((i) => i.trim())
      industries.forEach((industry) => {
        industryCount[industry] = (industryCount[industry] || 0) + 1
      })
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startups.length}</div>
            <p className="text-xs text-muted-foreground">+{pendingStartups.length} pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{industries.length}</div>
            <p className="text-xs text-muted-foreground">Across all startups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customFields.length}</div>
            <p className="text-xs text-muted-foreground">Additional data points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Directory Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="startups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="startups">All Startups</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="fields">Manage Fields</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="startups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Startups</CardTitle>
              <CardDescription>Manage all startups in the directory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Business Model</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {startups.slice(0, 10).map((startup) => (
                    <TableRow key={startup.id}>
                      <TableCell className="font-medium">{startup.companyName}</TableCell>
                      <TableCell>{startup.industries?.split(",")[0] || "N/A"}</TableCell>
                      <TableCell>{startup.teamSize || "N/A"}</TableCell>
                      <TableCell>{startup.businessModelType || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/startup/${startup.id}`} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve new startup submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingStartups.length > 0 ? (
                    pendingStartups.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell className="font-medium">{startup.companyName}</TableCell>
                        <TableCell>{startup.industries || "N/A"}</TableCell>
                        <TableCell>{new Date(startup.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="default">
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No pending approvals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
              <CardDescription>Add and manage custom fields for startups</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomFieldsManager initialFields={customFields} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import CSV Data</CardTitle>
              <CardDescription>Import your existing startup data from a CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">Upload CSV File</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="outline">Select File</Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">CSV Format Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your CSV file should include the following columns:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mb-4">
                    <li>Company Name - Company name</li>
                    <li>Logo - Logo URL</li>
                    <li>Team Size - Team size range</li>
                    <li>Business Model Type - Business model</li>
                    <li>Website - Company website URL</li>
                    <li>Founded Date - Date founded</li>
                    <li>Industries - Business industries</li>
                    <li>Legal Name - Legal entity name</li>
                    <li>Email - Contact email</li>
                    <li>Phone Number - Contact phone</li>
                    <li>Social Media - Social media URL</li>
                    <li>User information - Team member details</li>
                  </ul>
                  <Button>Download Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
