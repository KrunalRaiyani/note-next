import React from "react";
import FileIcon from "./icons/FileIcon";

function NoteItemComponent({ title, date }) {
  function timeAgo(dateString) {
    const now = new Date();
    const pastDate = new Date(dateString);
    const seconds = Math.floor((now - pastDate) / 1000);

    const intervals = [
      { name: "y", seconds: 31536000 },
      { name: "m", seconds: 2592000 },
      { name: "d", seconds: 86400 },
      { name: "hr", seconds: 3600 },
      { name: "min", seconds: 60 },
      { name: "sec", seconds: 1 },
    ];

    for (const interval of intervals) {
      const intervalTime = Math.floor(seconds / interval.seconds);
      if (intervalTime >= 1) {
        if (interval.name === "d" && intervalTime > 30) {
          return `${Math.floor(intervalTime)} days ago`;
        }
        return `${intervalTime} ${interval.name} ago`;
      }
    }

    return "just now";
  }

  function truncateTitle(title) {
    if (title.length > 10) {
      return `${title.slice(0, 10)}...`;
    }
    return title;
  }

  const timeAgoText = timeAgo(date);
  const truncatedTitle = truncateTitle(title);

  return (
    <button className="flex items-center justify-between gap-2 px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <FileIcon className="w-4 h-4" />
        <span className="text-sm truncate">{truncatedTitle}</span>
      </div>
      <div className="text-xs text-muted-foreground dark:text-muted-foreground">
        {timeAgoText}
      </div>
    </button>
  );
}

export const NoteItem = React.memo(NoteItemComponent);
