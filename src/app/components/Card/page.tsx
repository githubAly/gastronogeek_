/* eslint-disable @next/next/no-img-element */
"use client";

import Link from 'next/link';
import React from 'react';
import { FaEye, FaUser } from 'react-icons/fa';


interface Recipe {
  slug: string;
  title: string;
  type: string;
  images?: string[];
  defaultPersons: number;
  difficulty: 1 | 2 | 3;
  commonTitle: string;
}

async function getRecipes() {
  const res = await fetch('https://api-gastronogeek.vercel.app/api/recipes/', {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération des recettes');
  return res.json();
}

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const firstImage = recipe.images?.[0] || 'https://via.placeholder.com/150'; 
  
  return (
    <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-50 shadow-lg rounded-lg overflow-hidden flex flex-col">
      <div className="relative group">
        <img
          className="w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-105"
          src={firstImage}
          alt={`Image de ${recipe.title}`}
        />
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold rounded-bl-lg px-2 py-1">
          {recipe.type}
        </div>
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaEye className="text-white text-3xl" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center flex-grow pb-6 pr-6 pl-6 bg-gray-50">
        <div className="flex items-center mt-4">
          <div className="flex items-center">
            {[...Array(recipe.defaultPersons)].map((_, index) => (
              <FaUser key={index} className="text-red-500" />
            ))}
            <span className="mx-2 text-gray-700 font-semibold">
              {recipe.defaultPersons}
            </span>
          </div>
          <span className="mx-1 text-xs text-gray-600">|</span>
          <span className="mx-1 text-xs text-gray-600">
            {`Difficulté : ${getDifficultyText(recipe.difficulty)}`}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">{recipe.title}</h2>
        <p className="mt-2 text-gray-600">{recipe.commonTitle}</p>
        
        <div className="mt-auto pt-4 flex justify-between items-center">
          <Link href={`/recettes/${recipe.slug}`} passHref>
            <button className="w-full py-2 px-4 rounded-lg bg-red-900 text-white font-semibold buttonHover">
              Voir la recette
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const getDifficultyText = (difficulty: 1 | 2 | 3): string => {
  switch (difficulty) {
    case 1:
      return "Facile";
    case 2:
      return "Moyen";
    case 3:
      return "Difficile";
    default:
      return "Inconnue";
  }
};

export default RecipeCard;
