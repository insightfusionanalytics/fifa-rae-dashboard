import type { Metadata } from "next";
import HeightClient from "./HeightClient";

export const metadata: Metadata = {
  title: "Height Analysis — FIFA Player Analysis",
  description:
    "Height distributions across positions, ratings, countries, and league tiers for 56,880 FIFA players.",
};

export default function HeightPage() {
  return <HeightClient />;
}
