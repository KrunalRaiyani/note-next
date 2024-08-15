import React, { useState } from "react";
import ReadIcon from "./icons/ReadIcon";
import WriteIcon from "./icons/WriteIcon";
import Trash2Icon from "./icons/Trash2Icon";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { deleteAccessApi } from "@/utils/apiCall";
import Spinner from "./ui/Spinner";

const AccessCard = ({
  permission,
  passcode,
  notes,
  permissionId,
  manageList,
}) => {
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccessApi(permissionId);
      toast.success("Access deleted successfully!");
      manageList(permissionId);
    } catch (error) {
      toast.error(error.message || "Failed to delete access");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="mb-2">
      <div
        className={`flex items-center justify-between p-4 rounded-md cursor-pointer ${
          open
            ? "bg-blue-50 dark:bg-blue-700 border-blue-500"
            : "bg-white dark:bg-slate-800 border-transparent"
        } border border-slate-300 dark:border-slate-700`}>
        <div className="flex gap-2 items-center">
          <div>
            {permission === "read" ? (
              <span className="text-slate-900 dark:text-slate-100">Read :</span>
            ) : (
              <span className="text-slate-900 dark:text-slate-100">
                Write :
              </span>
            )}
          </div>
          <div className="text-slate-900 dark:text-slate-100">{passcode}</div>
        </div>
        <div className="flex items-center">
          <button className="p-2 px-2" onClick={() => setOpen(!open)}>
            <ReadIcon />
          </button>
          <button className="p-2 px-2">
            <WriteIcon />
          </button>
          <button className="p-2 px-2" onClick={handleDelete}>
            <Trash2Icon className={"text-blue-500 dark:text-blue-400"} />
          </button>
        </div>
      </div>
      {open && (
        <div className="p-4 py-2">
          {notes?.map((item) => (
            <div key={item?.noteId}>{item?.title}</div>
          ))}
        </div>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this passcode? This action cannot be
            undone.
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
              {deleteLoading ? <Spinner className="text-white" /> : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccessCard;
