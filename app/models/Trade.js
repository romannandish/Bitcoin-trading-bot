import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  action: String,
  price: Number,
  time: String,
  profitLoss: Number,
  isOpen: Boolean, 
});

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
