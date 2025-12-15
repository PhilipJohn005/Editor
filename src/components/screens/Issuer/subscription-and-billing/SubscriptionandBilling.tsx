import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$9",
    features: [
      "500 credentials/month",
      "5 badge classes",
      "Basic templates",
      "Email support",
      "Customer Support"
    ],
    button: "Upgrade",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$29",
    features: [
      "5,000 credentials/month",
      "Unlimited badge classes",
      "Advanced canvas tool",
      "Priority support",
      "Custom branding",
    ],
    button: "Current Plan",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    features: [
      "Unlimited credentials",
      "White-label solution",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    button: "Upgrade",
    highlight: false,
  },
]

const SubscriptionandBilling = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Subscription and Billing</h2>
        <Button>Buy Credit</Button>
      </div>
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative  shadow-md">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Current Plan</CardTitle>
            <Badge className="">Active</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Professional Plan</p>
            <p className="text-lg font-semibold">$29/month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Usage Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-1">
              <span>750 / 1000 credentials used</span>
              <span>75%</span>
            </div>
            <Progress value={75} />
            <p className="text-xs text-gray-500 mt-2">
              Resets on: <span className="font-medium">01 Sept 2025</span>
            </p>
          </CardContent>
        </Card>
      </div>

      
      <div>
        <h3 className="font-semibold mb-4">Upgrade/Downgrade Plans</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`p-6 relative ${
                plan.highlight ? "border-2  shadow-lg" : "shadow"
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                  Popular
                </Badge>
              )}
              <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
              <p className="text-2xl font-bold">
                {plan.price}
                <span className="text-base font-normal text-gray-500">
                  /month
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-4 ${
                  plan.button === "Current Plan"
                    ? "bg-gray-300 text-gray-700 cursor-default"
                    : "text-white"
                }`}
              >
                {plan.button}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment + Billing History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">GPay</Button>
              <Button variant="outline">PhonePe</Button>
              <Button variant="outline">Paytm</Button>
              <Button variant="outline">Bank</Button>
            </div>
            <Button className="w-full text-white">Pay Now</Button>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y text-sm">
              <div className="flex justify-between py-2">
                <span>Purchased Starter Pack</span>
                <span>27-05-25</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Upgraded to Professional</span>
                <span>01-06-25</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Renewal</span>
                <span>01-07-25</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SubscriptionandBilling
