import { useState, useEffect } from "react";

export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      checkFreighter();
    }, 500);
  }, []);

  async function checkFreighter() {
    try {
      const { isConnected, getPublicKey } =
        await import("@stellar/freighter-api");
      const connected = await isConnected();
      setIsFreighterInstalled(true);
      if (connected.isConnected) {
        const key = await getPublicKey();
        setWalletAddress(key.publicKey);
      }
    } catch {
      setIsFreighterInstalled(false);
    }
  }

  async function connectWallet() {
    setLoading(true);
    setError(null);
    try {
      const { requestAccess, getPublicKey } =
        await import("@stellar/freighter-api");
      const result = await requestAccess();
      if (result.publicKey) {
        setWalletAddress(result.publicKey);
        setIsFreighterInstalled(true);
      }
    } catch (err) {
      setError("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
  }

  return {
    walletAddress,
    isFreighterInstalled,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };
}
