const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/emailTransporter');
const { promisify } = require("util");

const crypto = require('crypto');

const createToken=(name,id )=>
    {
         return jwt.sign({name,id }, 
        process.env.SECRET_KEY,
        {expiresIn: "30d"

         })
    }
exports.signup = async (req, res) => {
  console.log(req.body); 
    try {
        const { name,email,role,password,confirmPassword,age,birthdate,gender}= req.body
        console.log("create ");
        const newUser = await User.create({
        
        name , 
        email,
        role,
        password ,
        confirmPassword,
        age ,
        birthdate,
        gender
    });
      res.status(201).json({
        status: "success",
        data: { newUser },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail ",
        message: err,
      });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Vérifier si l'email et le mot de passe sont fournis
      if (!email || !password) {
        return res.status(400).json({
          status: "fail",
          message: "L'email et le mot de passe sont requis.",
        });
      }
  
      // Vérifier si l'email existe dans la base de données
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Email incorrect ou utilisateur non trouvé.",
        });
      }
  
      // Vérifier si le mot de passe est correct
      const isPasswordValid = await user.verifPass(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "fail",
          message: "Mot de passe incorrect.",
        });
      }
  
      // Si tout est valide, générer un token et renvoyer une réponse réussie
      const token = createToken(user.name, user._id);
      res.status(200).json({
        status: "success",
        message: "Connexion réussie.",
        token,
        data: { user },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: "Une erreur s'est produite lors de la connexion.",
        error: err.message, // Renvoyer uniquement le message d'erreur pour plus de clarté
      });
    }
  };
  exports.protectionMW = async (req, res, next) => {
    try {
      let token;
      // 1) thabat si el user connecter ou bien non
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return res.status(401).json({
          status: "fail",
          message: "you have to be logged in !!!!",
        });
      }
      // 2) thabat si el token valid ou bien lé
  
      let myToken = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
      console.log(myToken);
  
      // 3) thabat el user mizel mawjoub ou bien lé
      const myUser = await User.findById(myToken.id);
      if (!myUser) {
        return res.status(401).json({
          status: "fail",
          message: "User is no longer exists !!!!",
        });
      }
      // 4) thabt si el user badal el pass mte3ou ba3d ma sna3 el token ou bien lé
  
      if (myUser.validTokenDate(myToken.iat)) {
        return res.status(401).json({
          status: "fail",
          message: "token no longer valid !!!!",
        });
      }
      req.user = myUser;
      next();
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  };
  
  exports.howCanDo = (...roles) => {
    return async (req, res, next) => {
      try {
        console.log(roles);
        if (!roles.includes(req.user.role)) {
          return res.status(401).json({
            status: "fail",
            message: "you can not do this !!!!",
          });
        }
        next();
      } catch (error) {
        res.status(400).json({
          status: "fail",
          message: error,
        });
      }
    };
  };
  exports.logout = (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
      token: null, // Le client peut vider son stockage local en réponse
    });
  };


  
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Cet email n'existe pas.",
        });
      }
  
      const resetCode = crypto.randomInt(100000, 999999).toString();
      user.resetCode = resetCode;
      user.resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
      if (user.resetCodeExpiration < new Date()) {
        return res.status(400).json({
          status: "fail",
          message: "Le code de réinitialisation a expiré.",
        });
      }
      await user.save();
  
      await sendEmail({
        email: user.email,
        subject: "Réinitialisation de votre mot de passe",
        message: `Bonjour, voici votre code de réinitialisation : ${resetCode}. Il est valide pendant 10 minutes.`,
      });
  
      res.status(200).json({
        status: "success",
        message: "Un email de réinitialisation a été envoyé.",
      });
    } catch (err) {
      console.error("Erreur :", err);
      res.status(500).json({
        status: "fail",
        message: "Erreur lors de l'envoi de l'email.",
      });
    }
  };
  exports.resetPassword = async (req, res) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;
  
    try {
      // 1) Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Cet email n'existe pas.",
        });
      }
  
      // 2) Vérifier si le code de réinitialisation est correct et non expiré
      if (user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
        return res.status(400).json({
          status: "fail",
          message: "Code de réinitialisation invalide ou expiré.",
        });
      }
  
      // 3) Afficher les logs pour déboguer
      console.log("Nouveau mot de passe :", newPassword);
      console.log("Confirmation du mot de passe :", confirmPassword);
  
      // 4) Vérifier si le nouveau mot de passe correspond à la confirmation
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: "fail",
          message: "Les mots de passe ne correspondent pas.",
        });
      }
  
      // 5) Mettre à jour le mot de passe de l'utilisateur
      user.password = newPassword;
      user.confirmPassword = confirmPassword;
      user.resetCode = undefined; // Effacer le code de réinitialisation
      user.resetCodeExpiration = undefined; // Effacer la date d'expiration
      await user.save();
  
      // 6) Répondre avec un message de succès
      res.status(200).json({
        status: "success",
        message: "Mot de passe réinitialisé avec succès.",
      });
    } catch (err) {
      console.error("Erreur :", err);
      res.status(500).json({
        status: "fail",
        message: "Erreur lors de la réinitialisation du mot de passe.",
      });
    }
  };