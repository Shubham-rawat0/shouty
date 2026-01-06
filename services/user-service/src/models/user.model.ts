import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
    },

    googleId: {
      type: String,
    },

    password: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, sparse: true }); //sparse handles null index by not including them

UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const UrlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
    },

    shortUrl: {
      type: String,
      required: true,
    },

    timesUsed: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

UrlSchema.index({ shortUrl: 1 }, { unique: true });
UrlSchema.index({ createdBy: 1 }, { sparse: true });

export const UserModel = mongoose.model("User", UserSchema);
export const UrlModel = mongoose.model("Url", UrlSchema);
