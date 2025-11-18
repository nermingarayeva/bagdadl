const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const password = 'adminpassword123';  // Adminin şifrəsi

// Admin Qeydiyyatı
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // İstifadəçi artıq mövcuddursa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
const hashedPassword = await bcrypt.hash(password, 10);  // Şifrələnmiş şifrəni alırıq
console.log(hashedPassword);  // Konsolda şifrələnmiş şifrəni görəcəksiniz

    // Yeni istifadəçi yaradılır
    const newUser = new User({
      username,
      email,
      password,
      role: role === "admin" ? "admin" : "user", // Admin rolu qeydiyyatdan keçərkən təyin olunur
    });

    // Şifrəni şifrələyirik
    newUser.password = await bcrypt.hash(newUser.password, 10);

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

// Login funksiyası
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("User Found:", user); // İstifadəçini yoxlayaq

    if (!user) return res.status(400).json({ message: "User not found" });

    // Adminin bloklanmaması üçün əlavə yoxlama
    if (user.role === "admin" && user.blocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    // Şifrəni yoxlayaq
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // Şifrə uyğunluğunu yoxlayaq

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Şifrə doğrulandı
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "20h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
};
