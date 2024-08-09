import FileIcon from "./icons/FileIcon";

export function NoteItem({ title, date }) {
  return (
    <button className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <FileIcon className="w-4 h-4" />
        <span className="text-sm truncate">{title}</span>
      </div>
      <div className="text-xs text-muted-foreground dark:text-muted-foreground">
        {date}
      </div>
    </button>
  );
}
