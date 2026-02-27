import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "./firebase";
import api from "./services/api";

// Logs in a user using a social provider (Google or Twitter)
const loginWithProvider = async (providerName) => {
  let provider;

  // Select the correct Firebase auth provider based on input
  switch (providerName) {
    case "google":
      provider = googleProvider;
      break;
    case "twitter":
      provider = twitterProvider;
      break;
    default:
      throw new Error("Unsupported provider");
  }

  // Open Firebase popup for user authentication
  const result = await signInWithPopup(auth, provider);

  // Get Firebase ID token for authenticated user
  const idToken = await result.user.getIdToken();

  // Backend API URL from environment variable

  // Send ID token to backend for verification and login
  const res = await api.post(`/api/v1/auth/firebase`, {
    idToken,
  });

  if (!res.ok) throw new Error("Backend Firebase login failed");

  return await res.json();
};

export default loginWithProvider;
