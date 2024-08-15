// NoteEditor.js
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FilePenIcon from "./icons/FilePenIcon";
import SaveIcon from "./icons/SaveIcon";
import Trash2Icon from "./icons/Trash2Icon";
import SettingsIcon from "./icons/SettingsIcon";
import { useState, useEffect } from "react";
import Spinner from "./ui/Spinner";
import useCreateNote from "@/hooks/useCreateNote";
import GiveAccessModal from "./GiveAccessModal";
import AccessListModal from "./AccessListModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";

export function NoteEditor({
  colorMode,
  onDelete,
  currentNote,
  crrRoute,
  onSave,
  passcode,
  noteList,
}) {
  const [noteValue, setNoteValue] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { loading, createNote } = useCreateNote();
  const [openGiveAccess, setOpenGiveAccess] = useState(false);
  const [openAccessList, setOpenAccessList] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setNoteValue(currentNote.note || "");
      setNoteTitle(currentNote.title || "");
    }
  }, [currentNote]);

  const saveNote = async () => {
    const updatedNote = {
      ...currentNote,
      note: noteValue,
      title: noteTitle,
    };
    const response = await createNote(crrRoute, updatedNote, passcode);
    if (!loading) {
      onSave(response?.data || updatedNote);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveNote();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [noteValue, noteTitle]);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setShowDeleteDialog(false);
    try {
      await onDelete(currentNote?.noteId);
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePenIcon className="w-5 h-5" />
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
              className={`text-lg font-medium border-none bg-transparent focus:outline-none ${
                colorMode === "dark" ? "text-white" : "text-black"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={saveNote}>
              {loading ? (
                <Spinner className="text-white" />
              ) : (
                <SaveIcon className="w-5 h-5" />
              )}
            </Button>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2Icon className="w-5 h-5" />
                  <span className="sr-only">Delete Note</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this note? This action cannot
                  be undone.
                </AlertDialogDescription>
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    className={`flex items-center gap-2 ${
                      deleteLoading ? "cursor-wait" : "cursor-pointer"
                    } ${
                      deleteLoading ? "bg-red-400" : "bg-red-500"
                    } text-white hover:bg-red-600`}
                    disabled={deleteLoading}>
                    {deleteLoading ? (
                      <Spinner className="text-white" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 mr-2">
                <DropdownMenuItem onClick={() => setOpenGiveAccess(true)}>
                  Give Access
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenAccessList(true)}>
                  Access List
                </DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex-1 m-4">
        <Textarea
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          placeholder="Start writing your note..."
          className={`w-full h-full resize-none border-none focus:outline-none focus:ring-0 ${
            colorMode === "dark"
              ? "text-white bg-slate-800"
              : "text-black bg-white"
          }`}
          style={{ boxShadow: "none" }}
        />
      </div>
      <GiveAccessModal
        open={openGiveAccess}
        noteList={noteList}
        onClose={() => setOpenGiveAccess(false)}
      />
      <AccessListModal
        open={openAccessList}
        onClose={() => setOpenAccessList(false)}
        accessList={[]} // Pass accessList as a prop
      />
    </div>
  );
}
