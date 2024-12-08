import ShimanoLogo from "@/components/icons/shimano-logo";

export default function OurPartners() {
  return (
    <div className="mb-8 flex flex-col items-center space-y-8">
      <h2 className="mb-8 text-center text-3xl font-normal dark:text-white sm:text-4xl">
        <span className="font-semibold">Nasi partnerzy</span> w FTA
      </h2>
      <div className="flex items-center gap-x-16 max-md:flex-col max-md:gap-y-16">
        <ShimanoLogo />
        <span className="text-3xl">&bull;</span>
        <ShimanoLogo />
        <span className="text-3xl">&bull;</span>
        <ShimanoLogo />
      </div>
    </div>
  );
}
