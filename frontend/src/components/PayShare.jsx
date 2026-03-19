import { useState } from "react";
import useWallet from "../hooks/useWallet";

export default function PayShare({ bill, onBack, onPaid }) {
  const { walletAddress, isInstalled, connectWallet, loading } = useWallet();
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  if (!bill) return null;

  const handlePay = async () => {
    if (!walletAddress) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaying(false);
    setDone(true);
    setTimeout(() => onPaid({ ...bill, paid: (bill.paid || 0) + 1 }), 1500);
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <p className="page-title">Pay Your Share</p>
      <p className="page-sub">Bill #{bill.id}</p>
      <div className="form-box">
        <div className="share-box">
          <p>Your share</p>
          <h2>{bill.perShare} XLM</h2>
        </div>

        {done ? (
          <div className="success-box">
            <div className="icon">✅</div>
            <h3>Payment Successful!</h3>
            <p>Your share has been recorded on Stellar</p>
          </div>
        ) : (
          <div>
            {!walletAddress ? (
              <div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "14px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  Connect your Stellar wallet to pay
                </p>
                {!isInstalled ? (
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-full"
                    style={{
                      display: "block",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Install Freighter Wallet
                  </a>
                ) : (
                  <button
                    className="btn-full"
                    onClick={connectWallet}
                    disabled={loading}
                  >
                    {loading ? "Connecting..." : "Connect Freighter Wallet"}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div
                  style={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    Connected wallet
                  </p>
                  <p
                    style={{
                      color: "#a78bfa",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      wordBreak: "break-all",
                    }}
                  >
                    {walletAddress}
                  </p>
                </div>
                <button
                  className="btn-full"
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying
                    ? "Processing on Stellar..."
                    : `Pay ${bill.perShare} XLM`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
