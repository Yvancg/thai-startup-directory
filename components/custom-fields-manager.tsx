"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addCustomField, deleteCustomField } from "@/lib/actions"
import type { CustomField } from "@/lib/types"

interface CustomFieldsManagerProps {
  initialFields: CustomField[]
}

export default function CustomFieldsManager({ initialFields }: CustomFieldsManagerProps) {
  const [fields, setFields] = useState<CustomField[]>(initialFields)
  const [newField, setNewField] = useState({
    name: "",
    type: "string",
    required: false,
    options: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddField = async () => {
    if (!newField.name || !newField.type) return

    setIsSubmitting(true)

    try {
      const options =
        newField.type === "select" && newField.options
          ? newField.options.split(",").map((opt) => opt.trim())
          : undefined

      const result = await addCustomField({
        name: newField.name,
        type: newField.type as "string" | "number" | "date" | "boolean" | "select",
        required: newField.required,
        options,
      })

      if (result.success) {
        setFields([...fields, result.field])
        setNewField({
          name: "",
          type: "string",
          required: false,
          options: "",
        })
      }
    } catch (error) {
      console.error("Error adding custom field:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteField = async (id: string) => {
    try {
      const result = await deleteCustomField(id)
      if (result.success) {
        setFields(fields.filter((field) => field.id !== id))
      }
    } catch (error) {
      console.error("Error deleting custom field:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length > 0 ? (
            fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                <TableCell>{field.type === "select" && field.options ? field.options.join(", ") : "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteField(field.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No custom fields defined yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Card>
        <CardHeader>
          <CardTitle>Add New Field</CardTitle>
          <CardDescription>Create a custom field for startups to fill out during registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field-name">Field Name</Label>
                <Input
                  id="field-name"
                  placeholder="e.g., Funding Stage"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-type">Field Type</Label>
                <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                  <SelectTrigger id="field-type">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newField.type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="field-options">Options (comma separated)</Label>
                <Input
                  id="field-options"
                  placeholder="e.g., Pre-seed, Seed, Series A, Series B"
                  value={newField.options}
                  onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddField} disabled={isSubmitting || !newField.name}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
