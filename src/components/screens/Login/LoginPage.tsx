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
import { Separator } from "@/components/ui/separator";
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

const LoginPage = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    defaultValues: { otp: "" },
    resolver: zodResolver(otpSchema),
  });

  const onSubmitEmail = (data: z.infer<typeof emailSchema>) => {
    console.log("Email submitted:", data.email);
    setStep("otp");
  };

  const onSubmitOtp = (data: z.infer<typeof otpSchema>) => {
    console.log("OTP entered:", data.otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg px-6 py-8 shadow-sm/5 bg-card">
        <img src={logo} alt="Logo" className="object-contain h-12" />
        <p className="mt-4 text-xl font-semibold tracking-tight">
          Welcome Back
        </p>
        

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Form {...emailForm}>
                <form
                  className="w-full space-y-4"
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
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2 w-full">
                    Send OTP
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Form {...otpForm}>
                <form
                  className="w-full space-y-4"
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
                            className="w-full"
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
                      className="w-1/3"
                      onClick={() => setStep("email")}
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
        </AnimatePresence>

        <p className="mt-6 text-xs text-center text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
        <p className="mt-3 text-xs text-center text-muted-foreground">
          Need help?{" "}
          <span className="underline cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
