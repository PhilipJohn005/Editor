import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  SertifyLogo
} from "@/components/ui/logos";
import { Marquee } from "@/components/ui/marquee";

const Logos06Page = () => {
  return (
    <div className="relative mt-20 flex items-center justify-center px-6">
      <div className="overflow-hidden">
        <p className="text-center text-xl text-black font-medium">
          More than 2.2 million companies worldwide already trust us
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-14 gap-y-10 max-w-(--breakpoint-xl)">
          <Marquee
            pauseOnHover
            className="[--duration:20s] [&_svg]:mr-10 mask-x-from-70% mask-x-to-90%"
          >
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <SertifyLogo/>
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Logos06Page;
