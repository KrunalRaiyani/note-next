import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    route: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: [
      {
        permissionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permission",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
