import { useState } from "react";

export default function CreateBill({ onBack, onCreated }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !amount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const bill = {
      id: Math.floor(Math.random() * 1000),
      title,
      total: parseInt(amount),
      perShare: Math.floor(parseInt(amount) / participants),
      participants,
      paid: 0,
    };
    setLoading(false);
    onCreated(bill);
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <p className="page-title">Create a Bill</p>
      <p className="page-sub">Fill in the details and share with your group</p>
      <div className="form-box">
        <div className="field">
          <label>Bill Title</label>
          <input
            type="text"
            placeholder="Dinner at Pizza Hut"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Total Amount (XLM)</label>
          <input
            type="number"
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Number of People</label>
          <input
            type="number"
            min="2"
            max="10"
            value={participants}
            onChange={(e) => setParticipants(parseInt(e.target.value))}
          />
        </div>
        {amount && participants && (
          <div className="preview">
            <p>Each person pays</p>
            <h2>{Math.floor(parseInt(amount) / participants)} XLM</h2>
          </div>
        )}
        <button
          className="btn-full"
          onClick={handleCreate}
          disabled={loading || !title || !amount}
        >
          {loading ? "Creating on Stellar..." : "Create Bill"}
        </button>
      </div>
    </div>
  );
}
