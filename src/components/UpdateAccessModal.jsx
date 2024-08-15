import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import ReadIcon from "./icons/ReadIcon";
import WriteIcon from "./icons/WriteIcon";
import { toast } from "react-hot-toast";
import { updateAccessApi } from "@/utils/apiCall";

function UpdateAccessModal({ open, onClose, noteList, accessDetails }) {
  const [selectedAccess, setSelectedAccess] = useState(
    accessDetails?.permissionType || "read"
  );
  const [selectedNotes, setSelectedNotes] = useState(
    accessDetails?.noteIds || []
  );
  const [passcode, setPasscode] = useState(accessDetails?.passcode || "");

  const handleAccessChange = (accessType) => {
    setSelectedAccess(accessType);
  };

  const handleNoteChange = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handlePasscodeChange = (event) => {
    setPasscode(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await updateAccessApi({
        passcode,
        noteIds: selectedNotes,
        permissionType: selectedAccess,
      });
      toast.success("Access updated successfully!");

      // Clear inputs after successful submission
      setPasscode("");
      setSelectedNotes([]);
      setSelectedAccess("read");

      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="p-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          onClick={onClose}>
          {/* <XIcon className="w-5 h-5" /> */}
          JJJJ
        </button>
        <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Update Access
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-slate-700 dark:text-slate-400">
          Update access settings for the selected note.
        </AlertDialogDescription>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Access Type:
          </label>
          <div className="flex items-center space-x-4">
            <div
              onClick={() => handleAccessChange("read")}
              className={`cursor-pointer p-2 rounded-md border border-slate-300 dark:border-slate-700 flex items-center space-x-2 ${
                selectedAccess === "read"
                  ? "bg-blue-50 dark:bg-blue-700 border-blue-500"
                  : "bg-white dark:bg-slate-800 border-transparent"
              }`}>
              <ReadIcon />
              <span className="text-slate-900 dark:text-slate-100">Read</span>
            </div>
            <div
              onClick={() => handleAccessChange("write")}
              className={`cursor-pointer p-2 rounded-md border border-slate-300 dark:border-slate-700 flex items-center space-x-2 ${
                selectedAccess === "write"
                  ? "bg-blue-50 dark:bg-blue-700 border-blue-500"
                  : "bg-white dark:bg-slate-800 border-transparent"
              }`}>
              <WriteIcon />
              <span className="text-slate-900 dark:text-slate-100">Write</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Passcode:
          </label>
          <input
            type="text"
            value={passcode}
            onChange={handlePasscodeChange}
            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md dark:bg-slate-800 dark:text-slate-100"
            placeholder="Enter passcode"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Select Notes:
          </label>
          <div
            className="max-h-60 overflow-y-auto space-y-2 flex flex-col"
            style={{ maxHeight: "300px" }} // Fixed height for the note card container
          >
            {noteList?.map((note) => (
              <div
                key={note.noteId}
                onClick={() => handleNoteChange(note.noteId)}
                className={`flex items-center p-4 rounded-md cursor-pointer ${
                  selectedNotes.includes(note.noteId)
                    ? "bg-blue-50 dark:bg-blue-700 border-blue-500"
                    : "bg-white dark:bg-slate-800 border-transparent"
                } border border-slate-300 dark:border-slate-700`}>
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.noteId)}
                  readOnly
                  className="mr-2 h-4 w-4 border-slate-300 dark:border-slate-700 rounded text-blue-600 dark:text-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                />
                <span className="text-slate-900 dark:text-slate-100">
                  {note.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <AlertDialogCancel
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 rounded-md px-4 py-2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md px-4 py-2">
            Submit
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateAccessModal;
