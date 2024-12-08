import Hero from "@/components/hero";
import CurrentTournaments from "@/components/current-tournaments";
import WhatToFish from "@/components/what-to-fish";
import LatestBlogPosts from "@/components/latest-blog-posts";
import OurPartners from "@/components/our-partners";
import WhyUs from "@/components/why-us";

export default async function Index() {
  return (
    <>
      <Hero />
      <CurrentTournaments />
      <WhatToFish />
      <LatestBlogPosts />
      <OurPartners />
      <WhyUs />
    </>
  );
}
