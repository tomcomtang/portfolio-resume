import querystring from "querystring";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  process.env;

if (
  SPOTIFY_CLIENT_ID === undefined ||
  SPOTIFY_CLIENT_SECRET === undefined ||
  SPOTIFY_REFRESH_TOKEN === undefined
) {
  throw new Error("Missing Spotify environment variables");
}

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    next: {
      revalidate: 1800,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Spotify token request failed (${response.status}): ${text || response.statusText}`
    );
  }

  const { access_token: accessToken } = (await response.json()) as {
    access_token?: string;
  };
  if (!accessToken) {
    throw new Error("Spotify token response missing access_token");
  }
  return accessToken;
}

type Track = {
  track: {
    album: {
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
    };
    artists: {
      name: string;
    }[];
    duration_ms: 220146;
    external_urls: {
      spotify: string;
    };
    name: string;
  };
  played_at: string;
};

export type RecentlyPlayedResult = {
  source: "spotify" | "placeholder";
  name: string;
  album: string;
  albumImage: {
    url: string;
    height: number;
    width: number;
  };
  artist: string;
  duration: number;
  playedAt: string;
  url: string;
};

function getRecentlyPlayedPlaceholder() {
  return {
    source: "placeholder",
    name: "My lifestyle",
    album: "",
    albumImage: {
      url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      height: 1,
      width: 1,
    },
    artist: "",
    duration: 0,
    playedAt: "",
    url: "https://open.spotify.com",
  };
}

export async function getRecentlyPlayed() {
  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch {
    return getRecentlyPlayedPlaceholder();
  }

  let response: Response;
  try {
    response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Disable caching so UI doesn't keep old successful data
      // when Spotify turns into 403 again (e.g. non-premium).
      cache: "no-store",
    });
  } catch {
    return getRecentlyPlayedPlaceholder();
  }

  if (!response.ok) return getRecentlyPlayedPlaceholder();

  const data = (await response.json()) as { items?: Track[] };
  const mostRecent = data.items?.[0];

  if (!mostRecent?.track?.album?.images?.length) {
    return getRecentlyPlayedPlaceholder();
  }

  const albumImage = mostRecent.track.album.images.reduce((smallest, image) => {
    return image.width < smallest.width ? image : smallest;
  });

  return {
    source: "spotify",
    name: mostRecent.track.name,
    album: mostRecent.track.album.name,
    albumImage,
    artist: mostRecent.track.artists[0].name,
    duration: mostRecent.track.duration_ms,
    playedAt: mostRecent.played_at,
    url: mostRecent.track.external_urls.spotify,
  };
}
