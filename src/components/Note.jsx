"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import useColorMode from "@/hooks/useColorMode";

export function Note() {
  const [colorMode, setColorMode] = useColorMode();

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode);
  }, [colorMode]);

  return (
    <div
      className={`grid md:grid-cols-[260px_1fr] min-h-screen w-full ${
        colorMode === "dark" ? "dark" : ""
      }`}
    >
      <div className="flex flex-col bg-white dark:bg-slate-800 text-black dark:text-white p-4 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePenIcon className="w-5 h-5" />
            <h2 className="text-lg font-medium">Notes</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setColorMode(colorMode === "light" ? "dark" : "light")
              }
            >
              {colorMode === "light" ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle colorMode</span>
            </Button>
            <Button variant="ghost" size="icon">
              <PlusIcon className="w-5 h-5" />
              <span className="sr-only">New Note</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-3 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8 w-full bg-white dark:bg-slate-800 text-black dark:text-white dark:border-gray-300 outline-none"
              />
            </div>
            <div className="grid gap-1">
              <Link
                href="#"
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                prefetch={false}
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm truncate">Meeting Notes</span>
                </div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  2 days ago
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                prefetch={false}
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm truncate">Grocery List</span>
                </div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  1 week ago
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                prefetch={false}
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm truncate">Project Roadmap</span>
                </div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  3 days ago
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                prefetch={false}
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm truncate">Vacation Planning</span>
                </div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  1 month ago
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilePenIcon className="w-5 h-5" />
              <h2 className="text-lg font-medium">New Note</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <SaveIcon className="w-5 h-5" />
                <span className="sr-only">Save Note</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2Icon className="w-5 h-5" />
                <span className="sr-only">Delete Note</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 m-4">
          <Textarea
            placeholder="Start writing your note..."
            className={`w-full h-full resize-none border-none focus:outline-none focus:ring-0 ${
              colorMode === "dark"
                ? "text-white bg-slate-800"
                : "text-black bg-white"
            }`}
            style={{ boxShadow: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SaveIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function Trash2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
