"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { NoteEditor } from "./NoteEditor";
import useColorMode from "@/hooks/useColorMode";
import { getNotesApi } from "@/utils/apiCall";
import { useRouter } from "next/navigation";

export function Note({ params }) {
  const router = useRouter();

  const [colorMode, setColorMode] = useColorMode();
  const [noteList, setNoteList] = useState([]);
  const [currentNote, setCurrentNote] = useState({});

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode);
  }, [colorMode]);

  const handleDelete = () => {
    // Handle delete note logic
  };

  const getNotes = async (query = "") => {
    try {
      const res = await getNotesApi(params?.route, query);
      // console.log(data, "cehckData");
      setNoteList(res?.data?.data);
    } catch (error) {
      console.log(error?.response?.data, "cehckData");
      if (error?.response?.data?.action) {
        error?.response?.data?.action === "register" &&
          router.push("/register");
        error?.response?.data?.action === "login" &&
          router.push(`/login/${params?.route}`);
      }
    }
  };

  const searchFilter = (str) => {
    getNotes(`str=${str}`);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div
      className={`grid md:grid-cols-[260px_1fr] min-h-screen w-full ${
        colorMode === "dark" ? "dark" : ""
      }`}>
      <Sidebar
        colorMode={colorMode}
        setColorMode={setColorMode}
        noteList={noteList}
        searchFilter={searchFilter}
        setCurrentNote={setCurrentNote}
      />
      <NoteEditor
        colorMode={colorMode}
        onDelete={handleDelete}
        currentNote={currentNote}
      />
    </div>
  );
}
