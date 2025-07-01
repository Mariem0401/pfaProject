// reminderService.js
const cron = require('node-cron');
const Animal = require('../Model/animalModel');
const User = require('../Model/userModel'); // Assurez-vous d'avoir accès au modèle utilisateur
const sendEmail = require('../utils/emailTransporter');

// Configuration des délais de rappel (en jours)
const REMINDER_DAYS = [7, 3, 1]; // Rappels 7 jours, 3 jours et 1 jour avant

/**
 * Vérifie et envoie les rappels pour les rendez-vous à venir
 */
const checkAndSendReminders = async () => {
  try {
    const today = new Date();
    
    // Recherche des animaux avec des prochains rendez-vous médicaux
    const animalsWithUpcomingAppointments = await Animal.find({
      $or: [
        { nextCheckup: { $ne: null } },
        { 'vaccinations.nextDue': { $ne: null } }
      ]
    }).populate('proprietaire', 'email nom prenom');

    for (const animal of animalsWithUpcomingAppointments) {
      const owner = animal.proprietaire;
      
      // Vérifier si l'utilisateur préfère recevoir des emails
      if (!owner || !owner.email || !animal.notificationPreferences?.email) {
        continue;
      }

      // Vérifier les prochains check-ups
      if (animal.nextCheckup) {
        await checkDateAndSendReminder(animal.nextCheckup, today, animal, owner, 'checkup');
      }

      // Vérifier les prochaines vaccinations
      if (animal.vaccinations && animal.vaccinations.length > 0) {
        for (const vaccination of animal.vaccinations) {
          if (vaccination.nextDue) {
            await checkDateAndSendReminder(
              vaccination.nextDue, 
              today, 
              animal, 
              owner, 
              'vaccination',
              vaccination.name
            );
          }
        }
      }
    }
    
    console.log('Vérification des rappels terminée');
  } catch (error) {
    console.error('Erreur lors de la vérification des rappels:', error);
  }
};

/**
 * Vérifie si une date correspond à un jour de rappel et envoie l'email si nécessaire
 */
const checkDateAndSendReminder = async (appointmentDate, today, animal, owner, type, details = null) => {
  for (const days of REMINDER_DAYS) {
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - days);
    
    // Vérifier si aujourd'hui est un jour de rappel (avec une tolérance de quelques heures)
    if (isSameDay(reminderDate, today)) {
      // Envoyer le rappel
      await sendReminderEmail(owner.email, animal, appointmentDate, days, type, details);
      break;
    }
  }
};

/**
 * Vérifie si deux dates correspondent au même jour
 */
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Envoie un email de rappel pour un rendez-vous médical
 */
const sendReminderEmail = async (email, animal, appointmentDate, daysRemaining, type, details = null) => {
  const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let subject, message;
  
  if (type === 'checkup') {
    subject = `Rappel: Rendez-vous médical pour ${animal.nom} dans ${daysRemaining} jour(s)`;
    message = `Bonjour,\n\nNous vous rappelons que ${animal.nom} a un rendez-vous médical prévu le ${formattedDate}.\n\nN'oubliez pas de vous y préparer !\n\nL'équipe PawPal`;
  } else if (type === 'vaccination') {
    subject = `Rappel: Vaccination ${details} pour ${animal.nom} dans ${daysRemaining} jour(s)`;
    message = `Bonjour,\n\nNous vous rappelons que ${animal.nom} doit recevoir le vaccin "${details}" le ${formattedDate}.\n\nN'oubliez pas de vous y préparer !\n\nL'équipe PawPal`;
  }
  
  await sendEmail({
    email,
    subject, 
    message
  });
  
  console.log(`Rappel envoyé à ${email} pour ${animal.nom}`);
};

/**
 * Démarre le service de rappel avec une tâche cron
 */
const startReminderService = () => {
  // Exécuter tous les jours à 9h du matin
  cron.schedule('0 9 * * *', async () => {
    console.log('Exécution de la vérification des rappels...');
    await checkAndSendReminders();
  });
  
  console.log('Service de rappels démarré');
};

module.exports = {
  startReminderService,
  checkAndSendReminders // Exporté pour les tests ou l'exécution manuelle
};