import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileIcon from "./icons/FileIcon";
import FilePenIcon from "./icons/FilePenIcon";
import MoonIcon from "./icons/MoonIcon";
import PlusIcon from "./icons/PlusIcon";
import SearchIcon from "./icons/SearchIcon";
import SunIcon from "./icons/SunIcon";
import { NoteItem } from "./NoteListItem";
import { useState, useRef } from "react";

export function Sidebar({
  noteList,
  searchFilter,
  setCurrentNote,
  setColorMode,
  colorMode,
  createBlankNote,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timer = useRef(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  function search(e) {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      searchFilter(e?.target?.value);
    }, 200);
  }

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-800 text-black dark:text-white p-4 gap-4 ${
        isExpanded ? "h-auto max-h-screen overflow-auto" : "h-screen"
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilePenIcon className="w-5 h-5" />
          <h2 className="text-lg font-medium">Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle color mode"
            onClick={() =>
              setColorMode(colorMode === "light" ? "dark" : "light")
            }>
            {colorMode === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="New note"
            onClick={createBlankNote}>
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-4">
        <div className="grid gap-2">
          <div className="relative mb-2">
            <SearchIcon className="absolute left-2 top-3 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
            <Input
              type="search"
              onChange={search}
              placeholder="Search notes..."
              className="pl-8 w-full bg-white dark:bg-slate-800 text-black dark:text-white dark:border-gray-300 outline-none"
              style={{ boxShadow: "none" }}
            />
          </div>
          <div className="grid gap-1">
            {noteList
              ?.slice(0, isExpanded ? noteList.length : 10)
              .map((item) => (
                <button key={item._id} onClick={() => setCurrentNote(item)}>
                  <NoteItem title={item?.title} date={item?.createdAt} />
                </button>
              ))}
          </div>
        </div>
      </div>
      <Button variant="outline" className="mt-4" onClick={handleToggle}>
        {isExpanded ? "View Less" : "View More"}
      </Button>
    </div>
  );
}
