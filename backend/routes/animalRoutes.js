const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary"); // Assuming cloudinary upload config
const animalController = require("../Controller/animalController");
const { protectionMW } = require("../Controller/authController"); // Assuming protectionMW authenticates user
const healthController =require ("../Controller/healthController"); // Assuming health controllers

const uploadAnimalImage = upload.single('image');


router.post('/:id/health', protectionMW, healthController.addHealthRecord);
router.get('/:id/health', protectionMW, healthController.getHealthRecords);

router.post("/createProfil",
    protectionMW,
   animalController.uploadAnimalImage,
    animalController.createAnimal 
);

router.get("/mes-animaux",
    protectionMW, 
    animalController.getMesAnimaux 
);


router.get("/:id",
    protectionMW, // Still requires login
    animalController.getAnimalById // <<< Controller needs adjustment
);

// Update animal profile - Requires login AND ownership
router.patch(
    '/:id',
    protectionMW, // Ensures only logged-in users can attempt to update
    uploadAnimalImage, // Handle potential image upload
    animalController.updateAnimal // <<< Controller needs ownership check
);

// Delete animal profile - Requires login AND ownership
router.delete(
    '/:id',
    protectionMW, // Ensures only logged-in users can attempt to delete
    animalController.deleteAnimal // <<< Controller needs ownership check
);



module.exports = router;