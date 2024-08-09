import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FilePenIcon from "./icons/FilePenIcon";
import SaveIcon from "./icons/SaveIcon";
import Trash2Icon from "./icons/Trash2Icon";

export function NoteEditor({ colorMode, onSave, onDelete }) {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePenIcon className="w-5 h-5" />
            <h2 className="text-lg font-medium">New Note</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onSave}>
              <SaveIcon className="w-5 h-5" />
              <span className="sr-only">Save Note</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
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
  );
}
