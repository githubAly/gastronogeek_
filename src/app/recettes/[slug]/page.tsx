/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
}

interface Recipe {
  slug: string;
  title: string;
  license: string;
  category: string;
  defaultPersons: number;
  prepTime: string;
  difficulty: number;
  desc: string;
  images: string[];
  ingredients: Ingredient[];
  steps: string[];
  dressing: string;
}

type SuggestedRecipe = Recipe;

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch('https://api-gastronogeek.vercel.app/api/recipes/');
  const recipes = await res.json();
  return recipes;
}

async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.slug === slug);
}

const renderDifficultyPoints = (difficulty: number) => {
  const totalPoints = 3;
  const points: JSX.Element[] = [];

  for (let i = 1; i <= totalPoints; i++) {
    points.push(
      <span key={i} className={i <= difficulty ? 'text-yellow-500' : 'text-gray-400'}>
        ●
      </span>
    );
  }

  return points;
};

export default function RecipeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeBySlug(slug);
        if (!recipeData) throw new Error('Recette non trouvée');
        setRecipe(recipeData);

        const allRecipes = await getRecipes();
        const relatedRecipes = allRecipes.filter(
          (r) => r.license === recipeData.license && r.slug !== recipeData.slug
        );
        setSuggestedRecipes(relatedRecipes);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);

  const adjustIngredients = (ingredient: Ingredient) => {
    if (ingredient.quantity && recipe?.defaultPersons !== numberOfPeople) {
      const adjustedQuantity = ingredient.quantity * (numberOfPeople / recipe!.defaultPersons);
      return `${adjustedQuantity.toFixed(2)} ${ingredient.unit || ''}`;
    }
    return ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}` : '';
  };

  const handlePersonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setNumberOfPeople(value);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!recipe) {
    return <p>Recette non trouvée</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
          <p className="text-xl text-gray-500 mb-4">{recipe.license} • {recipe.category}</p>
          <p className="flex justify-center md:justify-start text-gray-600 mb-4">
            {[...Array(recipe.defaultPersons)].map((_, index) => (
              <FaUser key={index} className="text-red-500 mr-1" />
            ))}
            <span className="ml-2">{recipe.defaultPersons} personnes</span>
          </p>
          <p className="text-gray-600 mb-2"><strong>Temps de préparation:</strong> {recipe.prepTime}</p>
          <p className="text-gray-600 mb-4"><strong>Difficulté:</strong> {renderDifficultyPoints(recipe.difficulty)}</p>
          <div className="mt-6">
            <label className="text-lg font-semibold text-gray-700 mb-2">Nombre de personnes :</label>
            <input
              type="number"
              min="1"
              value={numberOfPeople}
              onChange={handlePersonChange}
              className="p-2 border rounded-lg w-20"
            />
          </div>
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <img
            className="w-full h-auto rounded-lg shadow-lg"
            src={recipe.images?.[0] || "/default-image.jpg"}
            alt={recipe.title}
          />
        </div>
      </div>


      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ingrédients</h3>
      {recipe.ingredients?.length > 0 ? (
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="mb-2">
              {adjustIngredients(ingredient)} {ingredient.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun ingrédient disponible.</p>
      )}

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h3>
      {recipe.steps?.length > 0 ? (
        <ol className="list-decimal pl-6 text-gray-700 mb-6">
          {recipe.steps.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      ) : (
        <p>Aucune instruction disponible.</p>
      )}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dressage</h3>
      <p className="text-gray-700 mb-6">{recipe.dressing}</p>

      {suggestedRecipes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recettes suggérées :</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedRecipes.map((suggestedRecipe) => (
              <Link key={suggestedRecipe.slug} href={`/recettes/${suggestedRecipe.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={suggestedRecipe.images?.[0] || '/default-image.jpg'}
                    alt={suggestedRecipe.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800">{suggestedRecipe.title}</h4>
                    <p className="text-gray-600 text-sm">{suggestedRecipe.category}</p>
                    <p className="text-gray-500 text-sm">{suggestedRecipe.license}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
