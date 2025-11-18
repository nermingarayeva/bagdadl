require('dotenv').config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

console.log("=== ADMIN YARATMA BAŞLADI ===");

async function createAdmin() {
  try {
    console.log("\n1️⃣ .env faylı yüklənir...");
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("JWT_SECRET mövcuddur:", !!process.env.JWT_SECRET);
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI .env faylında tapılmadı!");
    }

    console.log("\n2️⃣ MongoDB-yə qoşulur...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB bağlantısı uğurlu!");

    console.log("\n3️⃣ Mövcud adminlər yoxlanılır...");
    const adminCount = await Admin.countDocuments();
    console.log("Cari admin sayı:", adminCount);

    const existingAdmin = await Admin.findOne({ email: "gryvnrmn@gmail.com" });
    
    if (existingAdmin) {
      console.log("\n⚠️ Admin artıq mövcuddur!");
      console.log("Email:", existingAdmin.email);
      console.log("ID:", existingAdmin._id);
      await mongoose.disconnect();
      console.log("\n=== PROSES TAMAMLANDI ===");
      process.exit(0);
    }

    console.log("\n4️⃣ Yeni admin yaradılır...");
    const admin = new Admin({
      email: "garayevanrmn@gmail.com",
      password: "nermingr337"
    });

    console.log("5️⃣ Admin database-ə yadda saxlanılır...");
    await admin.save();
    
    console.log("\n✅✅✅ UĞURLU! ✅✅✅");
    console.log("Admin yaradıldı:");
    console.log("  📧 Email:", admin.email);
    console.log("  🆔 ID:", admin._id);
    
    await mongoose.disconnect();
    console.log("\n=== PROSES TAMAMLANDI ===");
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌❌❌ XƏTA! ❌❌❌");
    console.error("Xəta növü:", error.name);
    console.error("Xəta mesajı:", error.message);
    
    if (error.stack) {
      console.error("\nTam xəta:");
      console.error(error.stack);
    }
    
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error("Bağlantını kəsmək mümkün olmadı:", e.message);
    }
    
    process.exit(1);
  }
}

createAdmin();