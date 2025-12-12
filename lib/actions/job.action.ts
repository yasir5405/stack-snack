"use server";

import handleError from "../handlers/error";

export const fetchLocation = async () => {
  try {
    const response = await fetch("https://ip-api.com/json/?fields=country", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Geo lookup failed");
    const location = await response.json();
    return location.country ?? "United States";
  } catch {
    return "United States";
  }
};

export const fetchCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const result = await response.json();
    return result;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { page, query } = filters;

  try {
    const headers = {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    };

    if (!headers["X-RapidAPI-Key"]) {
      throw new Error("Missing RAPIDAPI_KEY");
    }

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("fetchJobs failed:", error);
    return [];
  }
};
