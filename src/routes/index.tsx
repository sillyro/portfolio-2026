import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/site/PortfolioHome";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rohan Misra — Product Designer · Systems, Sound & Soul" },
      {
        name: "description",
        content:
          "Portfolio of Rohan Misra, a product designer exploring the intersection of engineering logic and cultural intuition.",
      },
      { property: "og:title", content: "Rohan Misra — Product Designer" },
      {
        property: "og:description",
        content: "Systems, Sound & Soul — selected product design work, 2023–2025.",
      },
    ],
  }),
});

function Index() {
  return <PortfolioHome />;
}
