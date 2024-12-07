"use client";

import styles from "./page.module.scss";
import Hero from "../app/components/Hero/page";
import Card from "../app/components/Card/page";
import { useEffect, useState } from "react";

interface Recipe {
  id: string;
  slug: string;
  title: string;
  type: string;
  images?: string[];
  defaultPersons: number;
  difficulty: 1 | 2 | 3;
  commonTitle: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startIndex, setStartIndex] = useState<number>(0);
  const cardsPerPage = 4;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("https://api-gastronogeek.vercel.app/api/recipes/");
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des recettes");
        }
        const data: Recipe[] = await res.json();
        setRecipes(data);
      } catch (err) {
        setError("Impossible de récupérer les recettes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setStartIndex((prevIndex) => (prevIndex === 0 ? recipes.length - cardsPerPage : prevIndex - 1));
    } else {
      setStartIndex((prevIndex) =>
        prevIndex + cardsPerPage >= recipes.length ? 0 : prevIndex + 1
      );
    }
  };

  const visibleRecipes = recipes.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div>
      <Hero />
      <div className={styles.description}>
        <h2 className={styles.title}>À propos de Gastronogeek</h2>
        <p className={styles.fullDescription}>
          Chez Gastronogeek, nous croyons que la cuisine est un terrain de jeu sans fin pour exprimer sa créativité. Nous vous offrons une expérience culinaire unique, où chaque plat est inspiré de l'univers geek. Plongez dans des recettes dignes des plus grands films, séries et jeux vidéo. Que vous soyez un fan de science-fiction, de fantasy ou d'aventures épiques, nous avons quelque chose pour chaque geek qui aime cuisiner.
        </p>
      </div>

      <div className={styles.carousel}>
        <h2 className={styles.carouselTitle}>Recettes Populaires</h2>
        {loading ? (
          <p>Chargement des recettes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className={styles.carouselWrapper}>
            <button className={styles.carouselButton} onClick={() => handleScroll("left")}>
              ◀
            </button>

            <div className={styles.carouselContainer}>
              {visibleRecipes.map((recipe) => (
                <Card key={recipe.slug} recipe={recipe} />
              ))}
            </div>

            <button className={styles.carouselButton} onClick={() => handleScroll("right")}>
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
