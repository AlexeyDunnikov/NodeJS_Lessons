const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (course) {
  const clonedItems = [...this.cart.items];
  const ind = clonedItems.findIndex((c) => {
    return c.courseId.toString() === course._id.toString();
  });

  if (ind >= 0) {
    clonedItems[ind].count = clonedItems[ind].count + 1;
  } else {
    clonedItems.push({
      count: 1,
      courseId: course._id,
    });
  }

  this.cart = { items: clonedItems };
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let clonedItems = [...this.cart.items];
  const ind = clonedItems.findIndex(
    (c) => c.courseId.toString() === id.toString()
  );

  if (ind >= 0) {
    if (clonedItems[ind].count === 1) {
      clonedItems = clonedItems.filter(
        (c) => c.courseId.toString() !== id.toString()
      );
    } else {
      clonedItems[ind].count--;
    }
  }

  this.cart = { items: clonedItems };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};

module.exports = model("User", userSchema);
