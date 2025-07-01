import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import axiosConfig from "../axiosConfig";

const AnnonceDetailsPage = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnonceDetails = async () => {
      try {
        const response = await axios.get(`/api/annonces/${id}`, axiosConfig);
        setAnnonce(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce:", error);
        setLoading(false);
      }
    };

    fetchAnnonceDetails();
  }, [id]);

  return (
    <div className="annonce-details">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h1>{annonce.titre}</h1>
          <p>{annonce.description}</p>
          <p><strong>Type:</strong> {annonce.type}</p>
          <p><strong>Statut:</strong> {annonce.statut}</p>
          <img src={annonce.image} alt={annonce.titre} />
        </>
      )}
    </div>
  );
};

export default AnnonceDetailsPage;
