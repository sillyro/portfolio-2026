import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Featured } from "@/components/site/Featured";
import { ProjectIndex } from "@/components/site/ProjectIndex";
import { Foundations } from "@/components/site/Foundations";
import { Footer } from "@/components/site/Footer";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Featured />
        <ProjectIndex />
        <Foundations />
      </main>
      <Footer />
    </div>
  );
}
