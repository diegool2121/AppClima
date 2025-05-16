import { useState, useEffect } from "react";
import axios from "axios";
import { getTemperatureGradient } from "../utils/getTemperatureGradient";
import { getWeatherDescriptionGradient } from "../utils/getWeatherDescriptionGradient";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const handleSearch = async (lat?: number, lon?: number) => {
    try {
      setError("");
      let url = "";

      if (lat !== undefined && lon !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
      }

      const response = await axios.get<WeatherData>(url);
      setWeather(response.data);
      setSuggestions([]);
    } catch (err) {
      setError("Ciudad no encontrada o error en la solicitud.");
      setWeather(null);
    }
  };

  const handleLocationSearch = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          handleSearch(latitude, longitude);
        },
        () => {
          setError("No se pudo acceder a tu ubicación.");
        }
      );
    } else {
      setError("Tu navegador no soporta geolocalización.");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get<Suggestion[]>(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
        );
        setSuggestions(res.data);
      } catch (err) {
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(() => fetchSuggestions(), 400);
    return () => clearTimeout(timeout);
  }, [city, apiKey]);

  // Determinar gradiente dinámico
  let gradient = "from-blue-200 to-blue-500";
  if (weather) {
    const tempGradient = getTemperatureGradient(weather.main.temp);
    const descGradient = getWeatherDescriptionGradient(weather.weather[0].description);
    gradient = tempGradient;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center relative">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">☁️ Aplicación del Clima</h1>

        <div className="relative mb-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ingresa una ciudad"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 bg-white border mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto text-left text-black">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setCity(`${s.name}, ${s.country}`);
                    handleSearch(s.lat, s.lon);
                  }}
                >
                  {s.name}{s.state ? `, ${s.state}` : ""}, {s.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => handleSearch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Buscar
          </button>
          <button
            onClick={handleLocationSearch}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            📍 Usar mi ubicación
          </button>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        {weather && (
          <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-black">Clima en {weather.name}</h2>
            <p className="mt-2 text-lg text-black">🌡️ <strong>Temperatura:</strong> {weather.main.temp} °C</p>
            <p className="text-lg text-black">💧 <strong>Humedad:</strong> {weather.main.humidity}%</p>
            <p className="text-lg text-black">🌤️ <strong>Descripción:</strong> {weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
