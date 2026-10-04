"use client";
import { useCallback, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import ScrollExperience from "@/components/ScrollExperience";
import ContactFooter from "@/components/ContactFooter";
export default function Home() {
  const [ready, setReady] = useState(false);
  const handleDone = useCallback(() => setReady(true), []);
  return <SmoothScroll><Preloader onDone={handleDone} /><Nav /><main id="main"><ScrollExperience start={ready} /><ContactFooter /></main></SmoothScroll>;
}
