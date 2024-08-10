import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    passcode: { type: String, required: true },
    permissions: { type: String, enum: ["read", "write"], required: true },
    noteIds: [{ type: String, ref: "Note" }],
  },
  {
    timestamps: true,
  }
);

const PermissionModel =
  mongoose.models.Permission || mongoose.model("Permission", permissionSchema);

export default PermissionModel;
