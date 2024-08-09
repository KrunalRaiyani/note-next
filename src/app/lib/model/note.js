import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    noteId: { type: String, required: true, unique: true },
    note: { type: String, required: true },
    title: { type: String },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const NoteModel = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default NoteModel;
