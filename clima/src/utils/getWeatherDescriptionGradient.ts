export function getWeatherDescriptionGradient(description: string): string {
  const lower = description.toLowerCase();

  if (lower.includes("lluvia")) return "from-gray-500 to-blue-700";        // Lluvia
  if (lower.includes("nube")) return "from-gray-300 to-gray-500";          // Nublado
  if (lower.includes("tormenta")) return "from-indigo-800 to-gray-700";    // Tormenta
  if (lower.includes("nieve")) return "from-blue-200 to-white";            // Nieve
  if (lower.includes("despejado")) return "from-yellow-200 to-blue-300";   // Despejado
  if (lower.includes("niebla") || lower.includes("bruma")) return "from-gray-400 to-gray-600"; // Niebla
  return "from-blue-200 to-blue-500"; // Por defecto
}
