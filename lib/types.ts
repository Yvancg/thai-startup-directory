export interface Startup {
  id: string
  companyName: string
  logo?: string
  teamSize?: string
  businessModelType?: string
  website: string
  foundedDate?: string
  industries?: string
  legalName?: string
  email?: string
  phoneNumber?: string
  socialMedia?: string
  user1Name?: string
  user1Position?: string
  user1Email?: string
  user2Name?: string
  user2Position?: string
  user2Email?: string
  createdAt: string
  updatedAt: string
  status: "pending" | "active" | "rejected"
  // For custom fields added by admin
  customFields?: Record<string, string>
}

export interface StartupFormData {
  companyName: string
  logo?: string
  teamSize?: string
  businessModelType?: string
  website: string
  foundedDate?: string
  industries?: string
  legalName?: string
  email?: string
  phoneNumber?: string
  socialMedia?: string
  user1Name?: string
  user1Position?: string
  user1Email?: string
  user2Name?: string
  user2Position?: string
  user2Email?: string
  customFields?: Record<string, string>
}

export interface CustomField {
  id: string
  name: string
  type: "string" | "number" | "date" | "boolean" | "select"
  required: boolean
  options?: string[] // For select type fields
  createdAt: string
}
