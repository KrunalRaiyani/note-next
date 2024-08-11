import toast from "react-hot-toast";

// Utility function to show success toast
export const showSuccessToast = (message) => {
  toast.success(message);
};

// Utility function to show error toast
export const showErrorToast = (message) => {
  toast.error(message || "Something want wrong");
};
