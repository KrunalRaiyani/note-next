"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { NoteEditor } from "./NoteEditor";
import useColorMode from "@/hooks/useColorMode";
import { deleteNoteApi, getNotesApi } from "@/utils/apiCall";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Note({ params }) {
  const router = useRouter();
  const { route, passcode } = params;

  const [colorMode, setColorMode] = useColorMode();
  const [noteList, setNoteList] = useState([]);
  const [currentNote, setCurrentNote] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode);
  }, [colorMode]);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteNoteApi(route, id, passcode);

      setNoteList((prev) => {
        const updatedNoteList = prev.filter((note) => note.noteId !== id);

        if (updatedNoteList.length === 0) {
          createBlankNote();
          return updatedNoteList;
        } else {
          setCurrentNote(updatedNoteList[0]);
          return updatedNoteList;
        }
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const createBlankNote = () => {
    const newNote = {
      noteId: Date.now(),
      title: "New Note",
      note: "",
    };
    setNoteList((prev) => [newNote, ...prev]);
    setCurrentNote(newNote);
  };

  const getNotes = async (query = "") => {
    try {
      const queryString = query
        ? `${query}&passcode=${passcode}`
        : passcode
        ? `passcode=${passcode}`
        : "";
      const res = await getNotesApi(route, queryString);
      const notes = res?.data?.data || [];

      setNoteList(notes);
      if (notes.length === 0 && !query) {
        createBlankNote();
      } else {
        setCurrentNote(notes[0] || {});
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.action) {
        if (error?.response?.data?.action === "register") {
          router.push("/register");
        }
        if (error?.response?.data?.action === "login") {
          router.push(`/login/${route}`);
        }
      }
    }
  };

  const searchFilter = (str) => {
    getNotes(`str=${str}`);
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleSave = (updatedNote) => {
    setNoteList((prev) =>
      prev.map((note) =>
        note.noteId === updatedNote.noteId ? updatedNote : note
      )
    );
    setCurrentNote(updatedNote);
  };

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
        createBlankNote={createBlankNote}
      />
      <NoteEditor
        colorMode={colorMode}
        onDelete={handleDelete}
        currentNote={currentNote}
        crrRoute={route}
        onSave={handleSave}
        deleteLoading={deleteLoading}
        passcode={passcode}
        noteList={noteList}
      />
    </div>
  );
}
