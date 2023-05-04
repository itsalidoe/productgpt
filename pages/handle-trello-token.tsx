import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function HandleTrelloToken() {
  const router = useRouter();

  if (typeof window !== "undefined") {
    // Check if the URL contains a token
    if (window.location.hash.includes("token=")) {
      // Extract the token from the URL
      const token = window.location.hash.split("=")[1];

      // Set the token as a cookie
      Cookies.set("trello-token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      window.history.replaceState(null, '', '/handle-trello-token');
      // Redirect to the desired page without the hash
      router.replace("/");
    }
  }

  return <div>Processing...</div>;
}
