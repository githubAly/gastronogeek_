"use client";

import React, { useState, useEffect } from "react";
import Filter from "../components/Filter/page";
import RecipeCard from "../components/Card/page";

interface Recipe {
  id: string;
  slug: string;
  title: string;
  type: string;
  images?: string[];
  defaultPersons: number;
  difficulty: 1 | 2 | 3;
  commonTitle: string;
  category: string;
  license: string;
}

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch("https://api-gastronogeek.vercel.app/api/recipes/");
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des recettes");
  }
  return res.json();
}

const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch {
        setError("Erreur lors de la récupération des recettes");
      }
    };

    fetchRecipes();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white">
      <Filter
        setFilteredRecipes={setFilteredRecipes} 
        recipes={recipes}
      />
      <div className="grid grid-cols-1 gap-6 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id || recipe.slug}
              recipe={recipe}
            />
          ))
        ) : (
          <p>Aucune recette trouvée</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
