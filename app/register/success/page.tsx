import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>

      <p className="text-muted-foreground mb-8">
        Thank you for registering your startup with our directory. Your submission has been received and will be
        reviewed by our team.
      </p>

      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/directory">Browse Directory</Link>
        </Button>

        <Button variant="outline" asChild className="w-full">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
