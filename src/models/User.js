import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.password;
  delete obj.createdAt;
  delete obj.updatedAt;

  return obj;
};

export const User = mongoose.model("User", userSchema);
