import React from "react";
import FileIcon from "./icons/FileIcon";

function NoteItemComponent({ title, date }) {
  function timeAgo(dateString) {
    const now = new Date();
    const pastDate = new Date(dateString);
    const seconds = Math.floor((now - pastDate) / 1000);

    const intervals = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const intervalTime = Math.floor(seconds / interval.seconds);
      if (intervalTime >= 1) {
        if (interval.name === "day" && intervalTime > 30) {
          return `${Math.floor(intervalTime)} days ago`;
        }
        return `${intervalTime} ${interval.name}${
          intervalTime > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now";
  }

  const timeAgoText = timeAgo(date);

  return (
    <button className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <FileIcon className="w-4 h-4" />
        <span className="text-sm truncate">{title}</span>
      </div>
      <div className="text-xs text-muted-foreground dark:text-muted-foreground">
        {timeAgoText}
      </div>
    </button>
  );
}

export const NoteItem = React.memo(NoteItemComponent);
