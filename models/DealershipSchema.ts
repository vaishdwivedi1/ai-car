import mongoose from "mongoose";

const WorkingHourSchema = new mongoose.Schema({
  isOpen: Boolean,
  openTime: String,
  closeTime: String,
});

const DealershipSchema = new mongoose.Schema({
  workingHours: [WorkingHourSchema],
});

export default mongoose.models.Dealership ||
  mongoose.model("Dealership", DealershipSchema);
