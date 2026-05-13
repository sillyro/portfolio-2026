import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/site/PortfolioHome";
import { SITE_DEFAULT_OG_IMAGE_PATH, SITE_ORIGIN, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rohan Misra — Product Designer · Systems, Sound & Soul · rohanmisra.studio" },
      {
        name: "description",
        content:
          "Portfolio of Rohan Misra, a product designer exploring the intersection of engineering logic and cultural intuition — rohanmisra.studio.",
      },
      { property: "og:title", content: "Rohan Misra — Product Designer · rohanmisra.studio" },
      {
        property: "og:description",
        content: "Systems, Sound & Soul — selected product design work. rohanmisra.studio",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/` },
      { property: "og:image", content: absoluteUrl(SITE_DEFAULT_OG_IMAGE_PATH) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absoluteUrl(SITE_DEFAULT_OG_IMAGE_PATH) },
    ],
  }),
});

function Index() {
  return <PortfolioHome />;
}
