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
import AccessCard from "./AccessCard";
import Trash2Icon from "./icons/Trash2Icon";

function AccessListModal({ open, onClose }) {
  const [selectedAccessId, setSelectedAccessId] = useState(null);
  const [editAccess, setEditAccess] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [accessList, setAccessList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditClick = (access) => {
    setEditAccess(access);
  };

  const manageList = (permissionId) => {
    let filterData = accessList?.filter(
      (item) => item?.permissionId != permissionId
    );
    setAccessList(filterData);
  };

  const getAccess = async () => {
    try {
      const result = await getAllAccessApi();
      setAccessList(result?.data?.permissions || []);
    } catch (error) {}
  };

  useEffect(() => {
    getAccess();
  }, []);

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent className="p-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg">
          <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Your Access List
          </AlertDialogTitle>
          <div className="max-h-[60vh] overflow-auto">
            {accessList?.map((item) => (
              <AccessCard
                key={item?.passcode}
                passcode={item?.passcode}
                notes={item?.notes}
                permission={item?.permissions}
                permissionId={item?.permissionId}
                manageList={manageList}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <AlertDialogCancel
              onClick={onClose}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 rounded-md px-4 py-2">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AccessListModal;
