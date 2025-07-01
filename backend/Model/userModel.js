const mongoose  = require("mongoose");
const validator = require("validator");
const bcrypt    = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  phone: {
    type: String,
    validate: {
      validator: v => validator.isMobilePhone(v || "", "any", { strictMode: false }),
      message: "Numéro de téléphone non valide",
    },
  },
  /* ---------- image Cloudinary ---------- */
  profilePic: {
    type: String,                              // URL https://res.cloudinary.com/…
    default: "/images/avatar-placeholder.png",
  },
  profilePicPublicId: { type: String },  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    select: false,
    required: [true, "Confirm password is required"],
    validate: {
      validator(cPass) {
        return cPass === this.password;
      },
      message: "Passwords do not match",
    },
  },
  age: Number,
  birthdate: Date,
  gender: {
    type: String,
    enum: ["femme", "homme"],
  },
  created_at: { type: Date, default: Date.now },
  update_pass_date: { type: Date, default: Date.now },
  resetCode:           String,
  resetCodeExpiration: Date,
});

// Hash du mot de passe avant save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password        = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.verifPass = async function (entered, hashed) {
  return bcrypt.compare(entered, hashed);
};
userSchema.methods.changedPasswordTime = function (JWTiat) {
  return JWTiat > parseInt(this.update_pass_date.getTime() / 1000);
};
userSchema.methods.validTokenDate = function (JWTDate) {
  const dataPass = parseInt(this.update_pass_date.getTime() / 1000);
  return JWTDate < dataPass;
};



const User = mongoose.model("User", userSchema);

module.exports = User;