import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Issuance() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Issue Credentials</h2>

      <Tabs defaultValue="manual" className="w-full">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Issue</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Issue</TabsTrigger>
        </TabsList>

        {/* Manual Issue Form */}
        <TabsContent value="manual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-200 p-6 rounded-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Recipient Email</label>
                <Input className="border border-black" placeholder="abc@gmail.com" />
              </div>
              <div>
                <label className="block text-sm mb-1">Recipient Name</label>
                <Input className="border border-black" placeholder="abc" />
              </div>
              <div>
                <label className="block text-sm mb-1">Certificate Class</label>
                <Input className="border border-black" placeholder="Web Developer" />
              </div>
              
            </div>

            <div>
              <label className="block text-sm mb-1">Evidence/Notes</label>
              <Textarea placeholder="Add notes here..." className="h-40 border border-black" />
            </div>
          </div>
          <Button className="w-full">Submit</Button>
        </TabsContent>

        {/* Bulk Issue Form */}
        <TabsContent value="bulk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-200 p-6 rounded-md">
            <div className="space-y-4 flex flex-col">
              <div>
                <label className="block text-sm mb-1">Certificate Class</label>
                <Input className="border border-black" placeholder="Marketing" />
              </div>
              <div className="flex flex-grow items-stretch">
                <Button variant="outline" className="w-full h-full ">Choose File</Button>
              </div>
              
            </div>

            <div>
              <label className="block text-sm mb-1">Column Mapping</label>
              <Textarea placeholder="Mapping preview..." className="h-40 border border-black" />
            </div>
          </div>
          <Button className="w-full">Upload</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
