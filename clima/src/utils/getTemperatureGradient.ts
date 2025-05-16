// utils/getTemperatureGradient.ts
export function getTemperatureGradient(temp: number): string {
  if (temp <= 0) return "from-blue-900 to-blue-500"; // frío extremo
  if (temp <= 10) return "from-blue-700 to-blue-300"; // frío
  if (temp <= 20) return "from-green-400 to-blue-200"; // templado fresco
  if (temp <= 30) return "from-yellow-300 to-orange-400"; // cálido
  return "from-red-500 to-yellow-500"; // calor extremo
}
