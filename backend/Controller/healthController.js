const Animal = require("../Model/animalModel");

exports.addHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, veterinarian, notes, nextVisit } = req.body;

    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ status: "fail", message: "Animal non trouvé" });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (animal.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ 
        status: "fail", 
        message: "Non autorisé" 
      });
    }

    const newRecord = {
      type,
      description,
      veterinarian,
      notes,
      nextVisit: nextVisit ? new Date(nextVisit) : undefined
    };

    animal.healthRecords.push(newRecord);
    
    // Mettre à jour les dates de check-up si c'est un check-up
    if (type === "checkup") {
      animal.lastCheckup = new Date();
      animal.nextCheckup = nextVisit ? new Date(nextVisit) : undefined;
    }

    await animal.save();

    res.status(201).json({
      status: "success",
      data: animal
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.getHealthRecords = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ status: "fail", message: "Animal non trouvé" });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (animal.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ 
        status: "fail", 
        message: "Non autorisé" 
      });
    }

    res.status(200).json({
      status: "success",
      data: animal.healthRecords
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};