"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { NoteEditor } from "./NoteEditor";
import useColorMode from "@/hooks/useColorMode";

export function Note() {
  const [colorMode, setColorMode] = useColorMode();

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode);
  }, [colorMode]);

  const history = [
    {
      _id: "1",
      title: "Meeting Notes",
      date: "206",
    },
    {
      _id: "2",
      title: "Grocery List",
      date: "7",
    },
    {
      _id: "3",
      title: "Project Roadmap",
      date: "3",
    },
    {
      _id: "4",
      title: "Vacation Planning",
      date: "30",
    },
  ];

  const handleSave = () => {
    // Handle save note logic
  };

  const handleDelete = () => {
    // Handle delete note logic
  };

  return (
    <div
      className={`grid md:grid-cols-[260px_1fr] min-h-screen w-full ${
        colorMode === "dark" ? "dark" : ""
      }`}
    >
      <Sidebar
        history={history}
        colorMode={colorMode}
        setColorMode={setColorMode}
      />
      <NoteEditor
        colorMode={colorMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
