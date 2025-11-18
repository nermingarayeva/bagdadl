const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ✅ Şifrəni hash et VƏ admin sayını yoxla (BİR pre-save-də)
adminSchema.pre("save", async function (next) {
  try {
    // Əgər yeni admin yaradılırsa, sayı yoxla
    if (this.isNew) {
      const adminCount = await mongoose.models.Admin.countDocuments();
      if (adminCount > 0) {
        throw new Error("Admin artıq mövcuddur! Yeni admin yaratmaq qadağandır.");
      }
    }

    // Şifrə dəyişdirilirsə, hash et
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Şifrə müqayisəsi üçün method
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);