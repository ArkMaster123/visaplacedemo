import 'server-only';

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
  const secretKey = process.env.NEXT_PUBLIC_HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.warn('Hume AI credentials not configured. Voice features will be disabled.');
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
      secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
    });

    if (accessToken === "undefined") {
      console.warn('Unable to get Hume AI access token');
      return null;
    }

    return accessToken ?? null;
  } catch (error) {
    console.error('Error fetching Hume AI access token:', error);
    return null;
  }
}; 