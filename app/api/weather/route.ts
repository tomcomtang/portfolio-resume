import { getWeatherByCoords } from "@/utilities/weather";

function getServerFallbackCoords() {
  const lat = Number(process.env.WEATHER_FALLBACK_LAT);
  const lon = Number(process.env.WEATHER_FALLBACK_LON);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return { lat, lon };
  }

  // Vercel region hint (best-effort). You can still override with env vars above.
  // Ref: https://vercel.com/docs/projects/environment-variables/system-environment-variables
  const region = process.env.VERCEL_REGION;
  if (region) {
    const map: Record<string, { lat: number; lon: number }> = {
      // Mainland China (approximate)
      hkg1: { lat: 22.3193, lon: 114.1694 }, // Hong Kong
      // US / EU common regions (approximate)
      iad1: { lat: 38.9072, lon: -77.0369 },
      sfo1: { lat: 37.7749, lon: -122.4194 },
      lhr1: { lat: 51.5072, lon: -0.1276 },
      fra1: { lat: 50.1109, lon: 8.6821 },
      arn1: { lat: 59.3293, lon: 18.0686 },
      sin1: { lat: 1.3521, lon: 103.8198 },
      syd1: { lat: -33.8688, lon: 151.2093 },
      bom1: { lat: 19.076, lon: 72.8777 },
      gru1: { lat: -23.5558, lon: -46.6396 },
    };
    const coords = map[region];
    if (coords) return coords;
  }

  // Default fallback (previously hard-coded)
  return { lat: 53.39, lon: 2.6 };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const lat = latParam === null ? NaN : Number(latParam);
  const lon = lonParam === null ? NaN : Number(lonParam);

  const coords =
    Number.isFinite(lat) && Number.isFinite(lon)
      ? { lat, lon }
      : getServerFallbackCoords();

  const weather = await getWeatherByCoords(coords.lat, coords.lon, {
    cache: "no-store",
  });
  return Response.json(weather);
}

