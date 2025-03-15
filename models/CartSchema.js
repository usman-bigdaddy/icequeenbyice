import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: [0, "Price cannot be negative"],
        },
        subtotal: {
          type: Number,
          default: 0, // Will be calculated dynamically
        },
      },
    ],
    total: {
      type: Number,
      default: 0, // Will be calculated dynamically
    },
  },
  { timestamps: true }
);

// Auto-calculate subtotal and total before saving
CartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.subtotal = item.quantity * item.price;
  });

  this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
