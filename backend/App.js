const express = require('express')
const App = express(); /*l'app est une instance d'express */
const fs = require('fs')
const multer = require('multer');
const dotenv =require('dotenv')
dotenv.config({path:"./config.env"});
const  mongoose =require('mongoose');
const path = require('path'); // Importer path pour gérer les chemins
const cors = require('cors');
const { demarrerRappelsAdmin } = require('./services/cronService');
App.use(cors({ origin: 'http://localhost:5173',  // L'adresse de ton frontend React
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Si tu utilises des cookies ou des informations d'identification
}));
const annonceRoutes = require("./routes/annonceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const panierRoutes = require("./routes/panierRoutes");
const animalRoutes = require("./routes/animalRoutes");

const commandeRoutes = require("./routes/commandeRoutes");

const ChatRoutes = require("./routes/ChatRoutes");
const adoptionRoutes = require("./routes/adoptionApplicationRoutes");


// Ajoutez cette ligne après les autres routes
const notificationRoutes = require('./routes/notificationRoutes');
App.use('/notifications', notificationRoutes);

// Planifiez un cron job pour les rappels (ex: toutes les 24h)
const cron = require('node-cron');
const { verifierAnnoncesNonTraitees } = require('./Controller/notificationController');

cron.schedule('0 0 * * *', () => { // Tous les jours à minuit
  verifierAnnoncesNonTraitees();
});
// Middleware pour parser les requêtes JSON
App.use(express.json());

// === Servir les fichiers statiques du dossier frontend ===
App.use(express.static(path.join(__dirname, "../frontend")));
App.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
const port = 7777 //num de port
App.listen(port,()=>{
    console.log(`App is running  on port ; ${port}...`)

}
); 
const statRoutes = require('./routes/statRoutes');
App.use('/stat', statRoutes);
App.use('/Chat', ChatRoutes);



App.use("/admin", adminRoutes);
App.use("/commandes", commandeRoutes);

App.use("/animaux", animalRoutes);
App.use('/users', userRoutes);
App.use("/products", productRoutes);
App.use("/panier", panierRoutes);
App.use("/annonces", annonceRoutes);
App.use('/adoptions', adoptionRoutes);
// connect to the data base 
const DB = process.env.DATABASE.replace("<db_password>",process.env.DATABASE_PASSWORD);
mongoose
.connect(DB)
.then((connection)=>{
    console.log("DB connected suc ");

})
.catch((err) => {
    console.log(err);
}); 