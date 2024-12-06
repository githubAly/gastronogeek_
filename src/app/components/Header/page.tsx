// "use client"; // Assurez-vous que le fichier est un composant client

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router"; // Pour la navigation

// // Fonction pour récupérer les recettes depuis l'API
// async function getRecipes() {
//   const res = await fetch("https://api-gastronogeek.vercel.app/api/recipes/");
//   if (!res.ok) {
//     throw new Error("Erreur lors de la récupération des recettes");
//   }
//   return res.json();
// }

// const Header = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]); // Liste des recettes filtrées
//   const [recipes, setRecipes] = useState<any[]>([]); // Liste des recettes initiales
//   const [isClient, setIsClient] = useState(false); // État pour vérifier si on est côté client
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       const data = await getRecipes();
//       setRecipes(data);
//     };

//     fetchRecipes();

//     // On marque que le composant est monté côté client
//     setIsClient(true);
//   }, []);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const term = event.target.value;
//     setSearchTerm(term);

//     if (term) {
//       const filtered = recipes.filter((recipe: any) =>
//         recipe.title.toLowerCase().includes(term.toLowerCase()) ||
//         (recipe.commonTitle && recipe.commonTitle.toLowerCase().includes(term.toLowerCase()))
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]); // Si la barre de recherche est vide, on vide les suggestions
//     }
//   };

//   const handleSuggestionClick = (slug: string) => {
//     // Redirige l'utilisateur vers la recette correspondante
//     router.push(`/recettes/${slug}`);
//   };

//   // Ne rend le contenu que si le composant est monté côté client
//   if (!isClient) {
//     return null;
//   }

//   return (
//     <header className="flex justify-between items-center p-6 bg-gray-800 text-white">
//       <div className="text-2xl font-bold">Gastronogeek</div>

//       <div className="relative w-96">
//         <input
//           type="text"
//           className="w-full p-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none"
//           placeholder="Rechercher des recettes..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</div>

//         {suggestions.length > 0 && (
//           <ul className="absolute left-0 right-0 bg-white text-black mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//             {suggestions.map((recipe) => (
//               <li
//                 key={recipe.slug}
//                 className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSuggestionClick(recipe.slug)}
//               >
//                 <img
//                   src={recipe.images[0] || "https://via.placeholder.com/50"}
//                   alt={recipe.title}
//                   className="w-12 h-12 object-cover rounded-md mr-4"
//                 />
//                 <span className="text-sm">{recipe.title}</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
