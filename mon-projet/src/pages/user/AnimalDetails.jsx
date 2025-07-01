import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AnimalDetails() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimal(res.data.data);
    };
    fetchAnimal();
  }, [id]);

  if (!animal) return <p className="text-center mt-4">Chargement...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-4">
      <img src={animal.photo} alt={animal.nom} className="w-full h-64 object-cover rounded" />
      <h2 className="text-2xl font-bold">{animal.nom}</h2>
      <p><strong>Espèce :</strong> {animal.espece}</p>
      <p><strong>Race :</strong> {animal.race}</p>
      <p><strong>Âge :</strong> {animal.age}</p>
      <p><strong>Genre :</strong> {animal.genre}</p>
      <p><strong>Description :</strong> {animal.description}</p>
    </div>
  );
}
