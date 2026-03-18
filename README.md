# 💸 Stellar Split

> **Split bills on the blockchain. No more chasing friends for money.**

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-7c3aed?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-a78bfa?style=for-the-badge)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Rust](https://img.shields.io/badge/Contract-Rust-f74c00?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Live Demo

🔗 **[https://stellar-split-app.vercel.app](https://stellar-split-app.vercel.app)**

---

## 📸 Screenshots

| Home Page                       | Create Bill                         | Bill Status                         | Pay Share                     |
| ------------------------------- | ----------------------------------- | ----------------------------------- | ----------------------------- |
| ![Home](./screenshots/home.png) | ![Create](./screenshots/create.png) | ![Status](./screenshots/status.png) | ![Pay](./screenshots/pay.png) |

---

## 🎯 What is Stellar Split?

Stellar Split is a decentralized bill-splitting dApp built on the **Stellar blockchain** using **Soroban smart contracts**.

The problem it solves:

> You go out with friends. One person pays. Then starts the endless chase — _"bhai send kar na"_ — that never gets resolved.

With Stellar Split:

- ✅ Create a bill on-chain in seconds
- ✅ Share a link with your group
- ✅ Everyone pays their exact share in XLM
- ✅ Funds release automatically when all paid
- ✅ **Zero trust required. Zero chasing needed.**

---

## ✨ Features

| Feature             | Description                                         |
| ------------------- | --------------------------------------------------- |
| 📝 **Create Bill**  | Set title, total amount, and number of participants |
| 🧮 **Auto Split**   | Per-share amount calculated and shown instantly     |
| 🔗 **Shareable**    | Share bill link with your group                     |
| 👀 **Live Status**  | See who has paid and who hasn't in real time        |
| 💜 **Pay Share**    | Pay your portion directly with your Stellar wallet  |
| ✅ **Auto Release** | Funds release to creator when everyone has paid     |
| 🚫 **Fraud Proof**  | Smart contract prevents double payments             |

---

## 🏗️ Tech Stack

| Layer              | Technology             |
| ------------------ | ---------------------- |
| **Smart Contract** | Rust + Soroban SDK v21 |
| **Blockchain**     | Stellar Testnet        |
| **Frontend**       | React.js + Vite        |
| **Wallet**         | Freighter Wallet       |
| **Styling**        | Custom CSS             |
| **Deployment**     | Vercel                 |
| **Testing**        | Soroban Test Framework |

---

## 📁 Project Structure

```
stellar-split/
│
├── contracts/
│   └── hello-world/
│       ├── Cargo.toml              # Contract dependencies
│       └── src/
│           └── lib.rs              # Soroban smart contract + tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateBill.jsx      # Bill creation form
│   │   │   ├── BillStatus.jsx      # Payment status tracker
│   │   │   └── PayShare.jsx        # Pay your share screen
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── Cargo.toml                      # Workspace config
└── README.md
```

---

## 📜 Smart Contract

The Soroban contract (`lib.rs`) has **5 core functions**:

```rust
// Create a new bill
pub fn create_bill(env, creator, total_amount, participants) -> u64

// Pay your share of the bill
pub fn pay_share(env, bill_id, payer)

// Release funds when all have paid
pub fn release_funds(env, bill_id) -> bool

// Get bill details and status
pub fn get_bill(env, bill_id) -> Bill

// Check if a specific address has paid
pub fn has_paid(env, bill_id, participant) -> bool
```

### Bill Data Structure

```rust
pub struct Bill {
    pub creator: Address,        // Who created the bill
    pub total_amount: i128,      // Total bill amount
    pub per_share: i128,         // Amount each person owes
    pub participants: Vec<Address>, // List of participants
    pub paid: Map<Address, bool>,   // Payment status per person
    pub released: bool,          // Whether funds are released
}
```

---

## 🧪 Tests

**4 tests written and passing:**

| Test                    | Description                                                            |
| ----------------------- | ---------------------------------------------------------------------- |
| `test_create_bill`      | Verifies bill is created with correct amount and per-share calculation |
| `test_pay_share`        | Verifies payment is recorded correctly on-chain                        |
| `test_release_funds`    | Verifies funds release only when ALL participants have paid            |
| `test_cannot_pay_twice` | Verifies smart contract rejects duplicate payments                     |

### ✅ Test Output

```
running 4 tests
test test::test_create_bill ... ok
test test::test_pay_share ... ok
test test::test_release_funds ... ok
test test::test_cannot_pay_twice - should panic ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured
```

> 📸 **Screenshot:** _(add your test output screenshot here)_

---

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli)
- [Node.js](https://nodejs.org/) v18+
- [Freighter Wallet](https://freighter.app/)

### 1. Clone the repository

```bash
git clone https://github.com/SarthakKshirsagar01/stellar-split-app.git
cd stellar-split-app
```

### 2. Run smart contract tests

```bash
cd contracts/hello-world
cargo test --lib
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎮 How to Use

**Step 1 — Create a Bill**

- Click "Create a Bill"
- Enter title, total amount in XLM, number of people
- Per-share amount is calculated automatically
- Click "Create Bill"

**Step 2 — Share with Friends**

- Copy the bill link
- Share in your WhatsApp/Telegram group

**Step 3 — Friends Pay Their Share**

- Friends open the link
- Connect their Stellar wallet
- Pay their exact share in XLM

**Step 4 — Automatic Release**

- Once everyone pays, funds are automatically sent to the bill creator
- No manual action needed

---

## 🔐 Security Features

- **Non-custodial** — funds go directly to the creator, never held by us
- **Duplicate payment protection** — contract rejects if you try to pay twice
- **Participant validation** — only listed participants can pay
- **Immutable records** — all payments recorded permanently on Stellar blockchain

---

## 🗺️ Roadmap

| Level          | Feature                                             |
| -------------- | --------------------------------------------------- |
| ✅ **Level 3** | Core bill splitting dApp with tests                 |
| 🔜 **Level 4** | Unequal splits, deadlines, payment timeouts         |
| 🔜 **Level 5** | Real wallet integration, shareable links, mobile UI |
| 🔜 **Level 6** | Group wallets, recurring bills, multi-currency      |

---

## 📝 Git Commits

```
feat: add soroban split bill contract with tests and react frontend
feat: add react UI with create bill, bill status and pay share pages
test: add 4 contract tests all passing
docs: add complete README with screenshots and documentation
```

---

## 👨‍💻 Author

**Sarthak Kshirsagar**

- GitHub: [@SarthakKshirsagar01](https://github.com/SarthakKshirsagar01)
- Built for: [Stellar Journey to Mastery — Level 3 Orange Belt](https://risein.com)

---

## 📄 License

MIT License — feel free to use and build on this project.

---

<div align="center">

**Built with 💜 on Stellar Blockchain**

_Stellar Journey to Mastery — Monthly Builder Challenges_

</div>
