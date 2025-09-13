import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import logo from '@/assets/sertify-logo-full.png'

const footerLinks = [
  {
    title: "Overview",
    href: "#",
  },
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Careers",
    href: "#",
  },
  {
    title: "Help",
    href: "#",
  },
  {
    title: "Privacy",
    href: "#",
  },
];

const Footer04Page = () => {
  return (
    <div className="flex flex-col">
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div>
              {/* Logo */}
            <img
              src={logo}
              className="w-auto h-10 object-contain"
            />

              <ul className="mt-6 flex items-center gap-4 flex-wrap">
                {footerLinks.map(({ title }) => (
                  <li key={title}>
                    <div
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {title}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full">
              <h6 className="font-medium">Stay up to date</h6>
              <form className="mt-6 flex items-center gap-2">
                <Input type="email" placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </form>
            </div>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
                Shadcn UI Blocks
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
                <TwitterIcon className="h-5 w-5" />
                <DribbbleIcon className="h-5 w-5" />
                <TwitchIcon className="h-5 w-5" />
                <GithubIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer04Page;
