"use client";

import { useState, useEffect } from "react";
import TransitionLink from "./TransitionLink";

interface Recipe {
  slug: string;
  title: string;
}

const Navigation = () => {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [,setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://api-gastronogeek.vercel.app/api/recipes/"
        );
        const data: Recipe[] = await res.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des recettes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);

    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  return (
    <nav className="w-full bg-white bg-opacity-2 p-5 flex flex-row place-items-center justify-between">
      <h1 className="text-3xl tracking-tight font-bold text-neutral-900">
        Gastronogeek
      </h1>

      <div className="flex items-center gap-5">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher une recette..."
          className="p-2 border rounded-lg focus:outline-none"
        />

        {query && filteredRecipes.length > 0 && (
          <div className="absolute bg-white shadow-md w-80 mt-2 rounded-md">
            {filteredRecipes.map((recipe) => (
              <TransitionLink
                key={recipe.slug}
                href={`/recettes/${recipe.slug}`}
                label={recipe.title}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-5">
        <TransitionLink key="home" href="/" label="Home" />
        <TransitionLink key="recettes" href="/recettes" label="Recettes" />
      </div>
    </nav>
  );
};

export default Navigation;
