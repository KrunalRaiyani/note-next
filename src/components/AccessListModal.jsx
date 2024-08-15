// AccessListModal.js
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Spinner from "./ui/Spinner";
import {
  deleteAccessApi,
  getAllAccessApi,
  updateAccessApi,
} from "@/utils/apiCall";
import { toast } from "react-hot-toast";

function AccessListModal({ open, onClose }) {
  const [selectedAccessId, setSelectedAccessId] = useState(null);
  const [editAccess, setEditAccess] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [accessList, setAccessList] = useState([]);

  const handleEditClick = (access) => {
    setEditAccess(access);
  };

  const handleDeleteClick = (accessId) => {
    setSelectedAccessId(accessId);
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      await updateAccessApi(editAccess.id, {
        passcode,
        noteIds: editAccess.noteIds,
        permissionType: editAccess.permissionType,
      });
      toast.success("Access updated successfully!");
      setEditAccess(null);
      setPasscode("");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update access");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccessApi(selectedAccessId);
      toast.success("Access deleted successfully!");
      setSelectedAccessId(null);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete access");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getAccess = async () => {
    try {
      const result = await getAllAccessApi();
      console.log(result, "cehckResult");
    } catch (error) {}
  };

  useEffect(() => {
    getAccess();
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="p-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg">
        <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Access List
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-slate-700 dark:text-slate-400">
          Manage access settings for your notes.
        </AlertDialogDescription>
        <div className="mt-4">
          <ul className="space-y-2">
            {accessList.map((access) => (
              <li
                key={access.id}
                className="flex justify-between items-center p-2 border border-slate-300 dark:border-slate-700 rounded-md">
                <span className="text-slate-900 dark:text-slate-100">
                  {access.noteTitle} - {access.permissionType}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(access)}
                    disabled={editLoading}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(access.id)}
                    disabled={deleteLoading}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {editAccess && (
          <AlertDialog
            open={!!editAccess}
            onOpenChange={() => setEditAccess(null)}>
            <AlertDialogContent className="p-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg">
              <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Edit Access
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-slate-700 dark:text-slate-400">
                Update access settings for the selected note.
              </AlertDialogDescription>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Passcode:
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Enter new passcode"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <AlertDialogCancel
                  onClick={() => setEditAccess(null)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 rounded-md px-4 py-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEditSubmit}
                  className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md px-4 py-2">
                  {editLoading ? <Spinner className="text-white" /> : "Save"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {selectedAccessId && (
          <AlertDialog
            open={!!selectedAccessId}
            onOpenChange={() => setSelectedAccessId(null)}>
            <AlertDialogContent className="p-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg">
              <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-slate-700 dark:text-slate-400">
                Are you sure you want to delete this access? This action cannot
                be undone.
              </AlertDialogDescription>
              <div className="flex justify-end gap-2 mt-6">
                <AlertDialogCancel
                  onClick={() => setSelectedAccessId(null)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 rounded-md px-4 py-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSubmit}
                  className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-md px-4 py-2">
                  {deleteLoading ? (
                    <Spinner className="text-white" />
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AccessListModal;
