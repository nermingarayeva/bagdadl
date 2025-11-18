const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ⚠️ BURAYA ÖZ DATABASE ADIN YAZU! (məsələn bagdad, ecommerce, test və s.)
const MONGO_URI = 'mongodb+srv://narminagazmp203:nermingr337@cluster0.0uxutul.mongodb.net/';

const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    console.log('🔄 MongoDB-yə bağlanır...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB-yə bağlandı!');

    console.log('🗑️ Köhnə adminləri silirik...');
    await Admin.deleteMany({});
    console.log('✅ Köhnə adminlər silindi');

    console.log('🔐 Şifrə hash edilir...');
    const hashedPassword = await bcrypt.hash('nermingr337', 10);
    console.log('✅ Hash yaradıldı:', hashedPassword);

    console.log('➕ Yeni admin yaradılır...');
    const admin = new Admin({
      email: 'garayevanrmn@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('✅✅✅ ADMIN UĞURLA YARADILDI! ✅✅✅');
    console.log('📧 Email:', admin.email);
    console.log('🆔 ID:', admin._id);

    console.log('🔍 Yoxlanılır...');
    const check = await Admin.findOne({ email: 'gryvnrmn@gmail.com' });
    console.log('✔️ Admin tapıldı:', check ? 'BƏLİ ✅' : 'XEYR ❌');

    await mongoose.disconnect();
    console.log('✅ Bağlantı bağlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌❌❌ XƏTA! ❌❌❌');
    console.error('Mesaj:', error.message);
    console.error('Tam xəta:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

console.log('🚀 Script başladı...');
createAdmin();