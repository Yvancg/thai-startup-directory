"use server"

import { revalidatePath } from "next/cache"
import type { StartupFormData, CustomField } from "./types"
import { getStartups } from "./data"

// Mock database for custom fields
let customFields: CustomField[] = [
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

export async function checkDuplicate(name: string, website: string) {
  // In a real implementation, this would query a database
  // For now, we'll use our mock data
  const existingStartups = await getStartups()

  // Check for exact name match
  const nameMatch = existingStartups.find((startup) => startup.companyName.toLowerCase() === name.toLowerCase())

  if (nameMatch) {
    return {
      isDuplicate: true,
      message: `A startup with the name "${name}" already exists in our directory.`,
    }
  }

  // Check for website match
  const websiteMatch = existingStartups.find((startup) => startup.website.toLowerCase() === website.toLowerCase())

  if (websiteMatch) {
    return {
      isDuplicate: true,
      message: `A startup with the website "${website}" already exists in our directory.`,
    }
  }

  // Check for similar names using fuzzy matching
  // This is a simplified implementation - in a real app, you'd use a proper fuzzy matching algorithm
  const similarNames = existingStartups.filter(
    (startup) =>
      startup.companyName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(startup.companyName.toLowerCase()),
  )

  if (similarNames.length > 0) {
    return {
      isDuplicate: true,
      message: `We found similar startup names in our directory. Please check if your startup is already registered.`,
    }
  }

  // No duplicates found
  return {
    isDuplicate: false,
    message: `Your startup appears to be unique in our directory.`,
  }
}

export async function registerStartup(data: StartupFormData) {
  // In a real implementation, this would save to a database
  console.log("Registering startup:", data)

  // Simulate a delay to mimic database operation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Revalidate the directory page to show the new startup
  revalidatePath("/directory")

  return { success: true }
}

export async function importCsvData(fileContent: string) {
  // In a real implementation, this would parse the CSV and save to a database
  console.log("Importing CSV data")

  // Simulate a delay to mimic database operation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Revalidate the directory page to show the new startups
  revalidatePath("/directory")

  return { success: true }
}

export async function approveStartup(id: string) {
  // In a real implementation, this would update the startup status in the database
  console.log("Approving startup:", id)

  // Simulate a delay to mimic database operation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Revalidate the directory page to show the updated startup
  revalidatePath("/directory")
  revalidatePath("/admin")

  return { success: true }
}

export async function deleteStartup(id: string) {
  // In a real implementation, this would delete the startup from the database
  console.log("Deleting startup:", id)

  // Simulate a delay to mimic database operation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Revalidate the directory page to remove the deleted startup
  revalidatePath("/directory")
  revalidatePath("/admin")

  return { success: true }
}

export async function addCustomField(field: Omit<CustomField, "id" | "createdAt">) {
  // In a real implementation, this would save to a database
  const newField: CustomField = {
    ...field,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  customFields.push(newField)

  // Revalidate the admin page
  revalidatePath("/admin")

  return { success: true, field: newField }
}

export async function deleteCustomField(id: string) {
  // In a real implementation, this would delete from a database
  customFields = customFields.filter((field) => field.id !== id)

  // Revalidate the admin page
  revalidatePath("/admin")

  return { success: true }
}

export async function getAllCustomFields() {
  return customFields
}
