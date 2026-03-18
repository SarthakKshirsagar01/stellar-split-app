import { useState } from "react";

export default function PayShare({ bill, onBack, onPaid }) {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!bill) return null;

  const handlePay = async () => {
    if (!wallet) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
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
        {!done ? (
          <>
            <div className="field">
              <label>Your Stellar Wallet Address</label>
              <input
                type="text"
                placeholder="G..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>
            <button
              className="btn-full"
              onClick={handlePay}
              disabled={loading || !wallet}
            >
              {loading
                ? "Processing on Stellar..."
                : `Pay ${bill.perShare} XLM`}
            </button>
          </>
        ) : (
          <div className="success-box">
            <div className="icon">✅</div>
            <h3>Payment Successful!</h3>
            <p>Your share has been recorded on Stellar</p>
          </div>
        )}
      </div>
    </div>
  );
}
