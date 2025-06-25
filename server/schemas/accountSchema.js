const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: String, // e.g. "google", "github", "credentials"
  providerAccountId: String, // unique per provider
  accessToken: String,
  refreshToken: String,
  expiresAt: Number,
  tokenType: String,
  scope: String
}, { timestamps: true });

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = mongoose.model("Account", accountSchema);


module.exports = Account