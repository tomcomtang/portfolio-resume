import { twMerge } from "tailwind-merge";

const { OPENWEATHER_API_KEY } = process.env;

const aliases: Record<string, string> = {
  Thunderstorm: "Stormy",
  Rain: "Rainy",
  Snow: "Snowy",
  Mist: "Misty",
  Smoke: "Smoky",
  Haze: "Hazy",
  Dust: "Dusty",
  Fog: "Foggy",
  Sand: "Sandy",
  Clouds: "Cloudy",
};

const backgrounds: Record<string, string> = {
  "01d": "from-blue-500 to-blue-200 dark:to-blue-700",
  "01n": "from-gray-600 to-gray-800",
  "02d": "from-blue-500 to-blue-200 dark:to-blue-700",
  "02n": "from-gray-600 to-gray-800",
  "03d": "from-gray-400 to-gray-200 dark:to-gray-700",
  "03n": "from-gray-600 to-gray-800",
  "04d": "from-gray-400 dark:from-gray-600 to-gray-200 dark:to-gray-700",
  "04n": "from-gray-600 to-gray-800",
  "09d": "from-gray-400 dark:from-gray-600 to-gray-200 dark:to-gray-700",
  "09n": "from-gray-600 to-gray-800",
  "10d": "from-blue-400 dark:from-blue-500 to-gray-200 dark:to-gray-700",
  "10n": "from-gray-600 to-gray-800",
  "11d": "from-gray-600 dark:from-gray-600 to-gray-200 dark:to-gray-700",
  "11n": "from-gray-900 dark:from-gray-800 to-gray-800 dark:to-gray-900",
  "13d": "from-gray-400 to-gray-200 dark:to-gray-600",
  "13n": "from-gray-500 to-gray-800",
  "50d": "from-gray-400 dark:from-gray-600 to-gray-200 dark:to-gray-700",
  "50n": "from-gray-600 to-gray-800",
};

type WeatherResult = {
  description: string;
  icon: string;
  background: string;
  location: string;
};

function unavailable(): WeatherResult {
  return {
    description: "Weather unavailable",
    icon: "/openweather/04d@4x.png",
    background: twMerge(
      "bg-gradient-to-b before:opacity-25 dark:before:opacity-25",
      "from-gray-400 to-gray-200 dark:from-gray-700 dark:to-gray-800",
      "text-white"
    ),
    location: "Location unavailable",
  };
}

export async function getWeatherByCoords(
  lat: number,
  lon: number,
  opts?: { cache?: RequestCache }
): Promise<WeatherResult> {
  if (!OPENWEATHER_API_KEY) return unavailable();

  const isProd = process.env.NODE_ENV === "production";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
    opts?.cache
      ? { cache: opts.cache }
      : isProd
        ? { next: { revalidate: 3600 } }
        : { cache: "no-store" }
  );

  if (!response.ok) {
    return unavailable();
  }

  const data = (await response.json()) as {
    weather?: { main: string; icon: string }[];
    name?: string;
    sys?: { country?: string };
  };

  const weather = data.weather?.[0];
  if (!weather?.main || !weather?.icon) {
    return unavailable();
  }

  const city = data.name?.trim();
  const country = data.sys?.country?.trim();
  const location =
    city && country ? `${city}, ${country}` : city || country || "Location unavailable";

  return {
    description: aliases[weather.main] ?? weather.main,
    icon: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
    background: twMerge(
      "bg-gradient-to-b before:opacity-25 dark:before:opacity-25",
      weather.icon.endsWith("n") && "text-white",
      backgrounds[weather.icon]
    ),
    location,
  };
}

export async function getWeather() {
  // Default (used when no user coords available)
  return await getWeatherByCoords(53.39, 2.6);
}
