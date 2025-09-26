import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/sertify-logo-full.png";


const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

const orgSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  adminName: z.string().min(2, "Admin name is required"),
  description: z.string().min(5, "Description is required"),
  logo: z.any().optional(),
});

const planSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]),
});

type Step = "email" | "otp" | "org" | "plan" | "confirm";

const SignupPage = () => {
  const [step, setStep] = useState<Step>("email");
  const [collectedData, setCollectedData] = useState<any>({});

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    defaultValues: { otp: "" },
    resolver: zodResolver(otpSchema),
  });

  const orgForm = useForm<z.infer<typeof orgSchema>>({
    defaultValues: { orgName: "", adminName: "", description: "", logo: null },
    resolver: zodResolver(orgSchema),
  });

  const planForm = useForm<z.infer<typeof planSchema>>({
    defaultValues: { plan: "free" },
    resolver: zodResolver(planSchema),
  });

  const onSubmitEmail = (data: z.infer<typeof emailSchema>) => {
    console.log("Email submitted:", data.email);
    setCollectedData((prev: any) => ({ ...prev, ...data }));
    setStep("otp");
  };

  const onSubmitOtp = (data: z.infer<typeof otpSchema>) => {
    console.log("OTP entered:", data.otp);
    setCollectedData((prev: any) => ({ ...prev, ...data }));
    setStep("org");
  };

  const onSubmitOrg = (data: z.infer<typeof orgSchema>) => {
    console.log("Org details:", data);
    setCollectedData((prev: any) => ({ ...prev, ...data }));
    setStep("plan");
  };

  const onSubmitPlan = (data: z.infer<typeof planSchema>) => {
    console.log("Plan chosen:", data.plan);
    setCollectedData((prev: any) => ({ ...prev, ...data }));
    setStep("confirm");
  };

  const onSubmitFinal = () => {
    console.log("Final submitted data:", collectedData);
    // Send to API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full flex flex-col items-center border rounded-lg px-6 py-8 shadow-sm/5 bg-card overflow-hidden">
        <img src={logo} alt="Logo" className="object-contain h-12" />
        <p className="mt-4 text-xl font-semibold tracking-tight">
          Create your account
        </p>

        <div className="relative w-full h-[320px] mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === "email" && (
              <motion.div
                key="email-step"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Form {...emailForm}>
                  <form
                    className="space-y-4"
                    onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Send OTP
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp-step"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Form {...otpForm}>
                  <form
                    className="space-y-4"
                    onSubmit={otpForm.handleSubmit(onSubmitOtp)}
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enter OTP</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="6-digit code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("email")}
                        className="w-1/3"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="w-2/3">
                        Verify OTP
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === "org" && (
              <motion.div
                key="org-step"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Form {...orgForm}>
                  <form
                    className="space-y-4"
                    onSubmit={orgForm.handleSubmit(onSubmitOrg)}
                  >
                    <FormField
                      control={orgForm.control}
                      name="orgName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your organization" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orgForm.control}
                      name="adminName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Person managing this account"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orgForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What does your org do?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orgForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Logo</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0] || null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("otp")}
                        className="w-1/3"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="w-2/3">
                        Continue
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === "plan" && (
              <motion.div
                key="plan-step"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Form {...planForm}>
                  <form
                    className="space-y-4"
                    onSubmit={planForm.handleSubmit(onSubmitPlan)}
                  >
                    <FormField
                      control={planForm.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Choose a Plan</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="space-y-2"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="free" />
                                <FormLabel className="!mt-0">Free</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="pro" />
                                <FormLabel className="!mt-0">Pro</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <RadioGroupItem value="enterprise" />
                                <FormLabel className="!mt-0">Enterprise</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("org")}
                        className="w-1/3"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="w-2/3">
                        Continue
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm-step"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full space-y-4"
              >
                <h3 className="text-lg font-semibold">Review & Confirm</h3>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(collectedData, null, 2)}
                </pre>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("plan")}
                    className="w-1/3"
                  >
                    Back
                  </Button>
                  <Button onClick={onSubmitFinal} className="w-2/3">
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
