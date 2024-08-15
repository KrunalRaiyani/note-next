import { useState } from "react";
import axios from "axios";
import { createNoteApi } from "@/utils/apiCall";
import toast from "react-hot-toast";

const useCreateNote = () => {
  const [loading, setLoading] = useState(false);

  const createNote = async (route, noteData, passcode) => {
    setLoading(true);

    try {
      if (noteData?.note) {
        const result = await createNoteApi(route, noteData, passcode);
        return result;
      } else {
        toast.error("Note content is required");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createNote,
  };
};

export default useCreateNote;
