"use client";

import Cookies from "js-cookie";

export default async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${Cookies.get("trello-token")}`,
      },
    });

    if (!response.ok)
      throw new Error('Failed to fetch! Response returned is not "ok".');

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error has occured in Trello fetcher: " + error);
  }
};
