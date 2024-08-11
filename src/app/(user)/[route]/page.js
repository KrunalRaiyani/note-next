"use client";
import { Note } from "@/components/Note";

export default function Home({ params }) {
  return (
    <div>
      <Note params={params} />
    </div>
  );
}
