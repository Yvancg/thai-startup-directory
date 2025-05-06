import type { Startup, CustomField } from "./types"

// This will be replaced with actual data from the CSV
let startups: Startup[] = []
const pendingStartups: Startup[] = []

// Custom fields that can be added by admin
const customFields: CustomField[] = [
  {
    id: "1",
    name: "Funding Stage",
    type: "select",
    required: false,
    options: ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Bootstrapped"],
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Number of Employees",
    type: "number",
    required: false,
    createdAt: "2023-01-01T00:00:00Z",
  },
]

interface GetStartupsOptions {
  page?: number
  category?: string
  search?: string
  industry?: string
  teamSize?: string
  businessModel?: string
}

export async function getStartups(options: GetStartupsOptions = {}) {
  // If startups array is empty, fetch from CSV
  if (startups.length === 0) {
    await loadStartupsFromCSV()
  }

  let filteredStartups = [...startups]

  // Filter by category/industry if provided
  if (options.industry) {
    filteredStartups = filteredStartups.filter((startup) =>
      startup.industries?.toLowerCase().includes(options.industry?.toLowerCase() || ""),
    )
  }

  // Filter by team size if provided
  if (options.teamSize) {
    filteredStartups = filteredStartups.filter((startup) => startup.teamSize === options.teamSize)
  }

  // Filter by business model if provided
  if (options.businessModel) {
    filteredStartups = filteredStartups.filter((startup) =>
      startup.businessModelType?.toLowerCase().includes(options.businessModel?.toLowerCase() || ""),
    )
  }

  // Filter by search term if provided
  if (options.search) {
    const searchLower = options.search.toLowerCase()
    filteredStartups = filteredStartups.filter(
      (startup) =>
        startup.companyName.toLowerCase().includes(searchLower) ||
        startup.legalName?.toLowerCase().includes(searchLower) ||
        startup.industries?.toLowerCase().includes(searchLower),
    )
  }

  // Implement pagination in a real app
  // For now, just return all startups
  return filteredStartups
}

export async function getPendingStartups() {
  // In a real implementation, this would query a database
  return pendingStartups
}

export async function getStartupById(id: string) {
  // In a real implementation, this would query a database
  const allStartups = [...startups, ...pendingStartups]
  return allStartups.find((startup) => startup.id === id)
}

export async function getCustomFields() {
  return customFields
}

export async function loadStartupsFromCSV() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thailand_startups_detailed-JmeZ5GMMMoZ360uoVAepBc23IMzFqL.csv",
    )
    const csvText = await response.text()

    // Parse CSV
    const rows = csvText.split("\n")
    const headers = rows[0].split(",").map((header) => header.trim().replace(/"/g, ""))

    startups = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Skip empty rows

      // Handle commas within quoted fields
      const row = rows[i]
      const values = []
      let inQuotes = false
      let currentValue = ""

      for (let j = 0; j < row.length; j++) {
        if (row[j] === '"' && (j === 0 || row[j - 1] !== "\\")) {
          inQuotes = !inQuotes
        } else if (row[j] === "," && !inQuotes) {
          values.push(currentValue.trim().replace(/^"|"$/g, ""))
          currentValue = ""
        } else {
          currentValue += row[j]
        }
      }

      // Add the last value
      values.push(currentValue.trim().replace(/^"|"$/g, ""))

      // Create startup object
      const startup: Startup = {
        id: i.toString(),
        companyName: values[headers.indexOf("Company Name")] || "",
        logo: values[headers.indexOf("Logo")] || undefined,
        teamSize: values[headers.indexOf("Team Size")] || undefined,
        businessModelType: values[headers.indexOf("Business Model Type")] || undefined,
        website: values[headers.indexOf("Website")] || "",
        foundedDate: values[headers.indexOf("Founded Date")] || undefined,
        industries: values[headers.indexOf("Industries")] || undefined,
        legalName: values[headers.indexOf("Legal Name")] || undefined,
        email: values[headers.indexOf("Email")] || undefined,
        phoneNumber: values[headers.indexOf("Phone Number")] || undefined,
        socialMedia: values[headers.indexOf("Social Media")] || undefined,
        user1Name: values[headers.indexOf("User 1 Name")] || undefined,
        user1Position: values[headers.indexOf("User 1 Position")] || undefined,
        user1Email: values[headers.indexOf("User 1 Email")] || undefined,
        user2Name: values[headers.indexOf("User 2 Name")] || undefined,
        user2Position: values[headers.indexOf("User 2 Position")] || undefined,
        user2Email: values[headers.indexOf("User 2 Email")] || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        customFields: {},
      }

      startups.push(startup)
    }

    console.log(`Loaded ${startups.length} startups from CSV`)
    return startups
  } catch (error) {
    console.error("Error loading startups from CSV:", error)
    return []
  }
}

export async function getIndustries() {
  // If startups array is empty, fetch from CSV
  if (startups.length === 0) {
    await loadStartupsFromCSV()
  }

  // Extract unique industries
  const industriesSet = new Set<string>()

  startups.forEach((startup) => {
    if (startup.industries) {
      // Handle multiple industries separated by commas
      const industries = startup.industries.split(",").map((i) => i.trim())
      industries.forEach((industry) => industriesSet.add(industry))
    }
  })

  return Array.from(industriesSet).sort()
}

export async function getTeamSizes() {
  // If startups array is empty, fetch from CSV
  if (startups.length === 0) {
    await loadStartupsFromCSV()
  }

  // Extract unique team sizes
  const teamSizesSet = new Set<string>()

  startups.forEach((startup) => {
    if (startup.teamSize) {
      teamSizesSet.add(startup.teamSize)
    }
  })

  return Array.from(teamSizesSet).sort()
}

export async function getBusinessModels() {
  // If startups array is empty, fetch from CSV
  if (startups.length === 0) {
    await loadStartupsFromCSV()
  }

  // Extract unique business models
  const businessModelsSet = new Set<string>()

  startups.forEach((startup) => {
    if (startup.businessModelType) {
      // Handle multiple business models separated by commas
      const models = startup.businessModelType.split(",").map((m) => m.trim())
      models.forEach((model) => businessModelsSet.add(model))
    }
  })

  return Array.from(businessModelsSet).sort()
}
