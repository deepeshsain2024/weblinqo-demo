import { useEffect, useRef } from "react";
import axios from "axios";
import useUserStore from "../stores/userStore";
import {
  isTokenExpired,
  getTokenIssuedTime,
  willExpireWithin,
} from "../utils/tokenUtils";
import api from "../services/api";

const useTokenRefresher = () => {
  const refreshToken = useUserStore((state) => state.refreshToken);
  const refreshTokenExpiry = useUserStore((state) => state.refreshTokenExpiry); // timestamp when refreshToken was issued
  const accessTokenExpiry = useUserStore((state) => state.accessTokenExpiry); // timestamp when accessToken was issued
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setRefreshToken = useUserStore((state) => state.setRefreshToken);
  const setRefreshTokenExpiry = useUserStore(
    (state) => state.setRefreshTokenExpiry
  );
  const setAccessTokenExpiry = useUserStore(
    (state) => state.setAccessTokenExpiry
  );
  const resetAll = useUserStore((state) => state.resetAll);

  const intervalRef = useRef(null);

  // --- Refresh Tokens ---
  const refreshTokens = async () => {
    if (!refreshToken) {
      console.warn("No refresh token available");
      resetAll();
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post(`/api/v1/auth/refresh-token`, {
        refreshToken,
      });

      if (response.status === 200 && response.data?.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // update store
        setAccessToken(accessToken);
        setRefreshToken(newRefreshToken);

        // track issue time (used to measure age)
        setAccessTokenExpiry(Date.now());
        setRefreshTokenExpiry(Date.now());

        console.log("Tokens refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Only logout if it's not a network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        resetAll();
        window.location.href = "/login";
      }
    }
  };

  // --- Monitor token lifetimes ---
  const checkTokens = () => {
    if (!refreshToken) {
      console.warn("No refresh token found");
      return;
    }

    // Check if refresh token is expired using JWT
    if (isTokenExpired(refreshToken)) {
      console.warn("Refresh token expired. Logging out...");
      resetAll();
      window.location.href = "/login";
      return;
    }

    // Get current access token from store
    const currentAccessToken = useUserStore.getState().accessToken;

    if (!currentAccessToken) {
      console.log("No access token found, refreshing...");
      refreshTokens();
      return;
    }

    // Check if access token is expired or will expire within 10 minutes
    if (
      isTokenExpired(currentAccessToken) ||
      willExpireWithin(currentAccessToken, 10 * 60 * 1000)
    ) {
      console.log("Access token expired or expiring soon -> refreshing...");
      refreshTokens();
    }
  };

  // --- Start background check ---
  useEffect(() => {
    if (refreshToken) {
      // check immediately on load
      checkTokens();

      // run check every 5 minutes (more frequent for better UX)
      intervalRef.current = setInterval(checkTokens, 5 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken, refreshTokenExpiry, accessTokenExpiry]);

  return { refreshTokens };
};

export default useTokenRefresher;
