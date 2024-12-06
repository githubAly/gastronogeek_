"use client";

import Image from "next/image";
import styles from "./page.module.scss"; // Nouveau fichier CSS spécifique au Hero
import fondImg from "../../../images/fond_img.jpeg"; // Mettez le chemin correct
import Link from "next/link";

export default function Hero() {
  return (
    <div className={styles.hero}>
      {/* Image de fond */}
      <div className={styles.backgroundImage}>
        <Image
          src={fondImg}
          alt="Cuisine"
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        <h1 className={styles.title}>Apprenez la Cuisine Moderne</h1>
        <p className={styles.subtitle}>
          Des recettes simples, rapides et savoureuses à découvrir.
        </p>
        <Link href="/recettes" passHref>
          <button className={styles.cta}>Voir les recettes</button>
        </Link>
      </div>
    </div>
  );
}
