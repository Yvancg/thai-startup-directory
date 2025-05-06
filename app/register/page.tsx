"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { checkDuplicate, registerStartup, getAllCustomFields } from "@/lib/actions"
import { getIndustries, getTeamSizes, getBusinessModels } from "@/lib/data"
import type { CustomField } from "@/lib/types"

// Create a dynamic form schema based on required fields
const createFormSchema = (customFields: CustomField[]) => {
  const baseSchema = {
    companyName: z.string().min(2, {
      message: "Company name must be at least 2 characters.",
    }),
    website: z.string().url({
      message: "Please enter a valid URL.",
    }),
    email: z
      .string()
      .email({
        message: "Please enter a valid email address.",
      })
      .optional(),
    legalName: z.string().optional(),
    teamSize: z.string().optional(),
    businessModelType: z.string().optional(),
    industries: z.string().optional(),
    foundedDate: z.string().optional(),
    phoneNumber: z.string().optional(),
    socialMedia: z.string().optional(),
    logo: z.string().optional(),
    user1Name: z.string().optional(),
    user1Position: z.string().optional(),
    user1Email: z.string().email().optional(),
    user2Name: z.string().optional(),
    user2Position: z.string().optional(),
    user2Email: z.string().email().optional(),
  }

  // Add custom fields to schema
  const customFieldsSchema: Record<string, any> = {}

  customFields.forEach((field) => {
    let fieldSchema

    switch (field.type) {
      case "string":
        fieldSchema = z.string()
        break
      case "number":
        fieldSchema = z.string().regex(/^\d+$/, {
          message: "Please enter a valid number.",
        })
        break
      case "date":
        fieldSchema = z.string()
        break
      case "boolean":
        fieldSchema = z.boolean()
        break
      case "select":
        fieldSchema = z.string()
        break
      default:
        fieldSchema = z.string()
    }

    if (!field.required) {
      fieldSchema = fieldSchema.optional()
    }

    customFieldsSchema[`custom_${field.id}`] = fieldSchema
  })

  return z.object({
    ...baseSchema,
    ...customFieldsSchema,
  })
}

export default function RegisterPage() {
  const router = useRouter()
  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [teamSizes, setTeamSizes] = useState<string[]>([])
  const [businessModels, setBusinessModels] = useState<string[]>([])

  // Create a dynamic form schema
  const formSchema = createFormSchema(customFields)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      website: "",
      email: "",
      legalName: "",
      teamSize: "",
      businessModelType: "",
      industries: "",
      foundedDate: "",
      phoneNumber: "",
      socialMedia: "",
      logo: "",
      user1Name: "",
      user1Position: "",
      user1Email: "",
      user2Name: "",
      user2Position: "",
      user2Email: "",
    },
  })

  // Fetch custom fields and options on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsData, industriesData, teamSizesData, businessModelsData] = await Promise.all([
          getAllCustomFields(),
          getIndustries(),
          getTeamSizes(),
          getBusinessModels(),
        ])

        setCustomFields(fieldsData)
        setIndustries(industriesData)
        setTeamSizes(teamSizesData)
        setBusinessModels(businessModelsData)
      } catch (error) {
        console.error("Error fetching form data:", error)
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // First check for duplicates
      const duplicateResult = await checkDuplicate(values.companyName, values.website)

      if (duplicateResult.isDuplicate) {
        setDuplicateCheck(duplicateResult)
        setIsSubmitting(false)
        return
      }

      // Process custom fields
      const customFieldsData: Record<string, string> = {}

      Object.entries(values).forEach(([key, value]) => {
        if (key.startsWith("custom_") && value) {
          const fieldId = key.replace("custom_", "")
          customFieldsData[fieldId] = value as string
        }
      })

      // If no duplicate, proceed with registration
      const formData = {
        ...values,
        customFields: customFieldsData,
      }

      await registerStartup(formData)
      setIsSuccess(true)

      // Redirect to success page after a delay
      setTimeout(() => {
        router.push("/register/success")
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function checkDuplicateOnBlur() {
    const name = form.getValues("companyName")
    const website = form.getValues("website")

    if (name.length > 2 && website) {
      const result = await checkDuplicate(name, website)
      setDuplicateCheck(result)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your startup has been registered successfully. Redirecting you to the confirmation page...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Register Your Startup</h1>
      <p className="text-muted-foreground mb-8">
        Join our directory of Thai startups to increase your visibility and connect with the ecosystem.
      </p>

      {duplicateCheck && (
        <Alert
          className={
            duplicateCheck.isDuplicate ? "bg-amber-50 border-amber-200 mb-6" : "bg-green-50 border-green-200 mb-6"
          }
        >
          {duplicateCheck.isDuplicate ? (
            <AlertCircle className="h-4 w-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <AlertTitle>{duplicateCheck.isDuplicate ? "Possible Duplicate Found" : "Looks Good!"}</AlertTitle>
          <AlertDescription>{duplicateCheck.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Your startup name" {...field} onBlur={checkDuplicateOnBlur} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Legal entity name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-startup.com" {...field} onBlur={checkDuplicateOnBlur} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foundedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founded Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jan 2022" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="industries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industries</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessModelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-startup.com/logo.png" {...field} />
                </FormControl>
                <FormDescription>Provide a URL to your company logo (recommended size: 200x200px)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+66 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialMedia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/yourstartup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-xl font-semibold pt-4">Team Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="user1Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Member 1 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user1Position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CEO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user1Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="user2Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Member 2 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user2Position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CTO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user2Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <>
              <h3 className="text-xl font-semibold pt-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customFields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`custom_${field.id}` as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>
                          {field.name}
                          {field.required ? "*" : ""}
                        </FormLabel>
                        <FormControl>
                          {field.type === "select" ? (
                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "boolean" ? (
                            <Checkbox checked={formField.value as boolean} onCheckedChange={formField.onChange} />
                          ) : (
                            <Input
                              type={field.type === "number" ? "number" : "text"}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              {...formField}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register Startup"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
