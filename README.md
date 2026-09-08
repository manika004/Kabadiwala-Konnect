# Kabadiwala Konnect ♻️
> **Short PRD Hackathon MVP** — Connecting households, informal waste collectors (Kabadiwalas), and recyclers through AI-assisted waste identification, smart pickup matching, and transparent recycling transactions.

---

## 🚀 Live Demo & Quick Start

Both backend and frontend are already running:
- **Live Deployed Link**: [Kabadiwala Konnect](https://kabadiwala-konnect-aigpi9clg-bitbybit3.vercel.app/)
- **Backend REST API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running manually:
```bash
# 1. Start Backend (Express + TypeScript + DB):
cd server
npm run dev

# 2. Start Frontend (React + Vite + Tailwind + Leaflet):
cd client
npm run dev
```

---

## 🎯 5-Step Hackathon Demo Walkthrough

Use the persistent **Role Switcher** in the top navigation bar to demo all personas:

1. **Step 1: AI Waste Scan (Household)**
   - Click **AI Waste Scan** in the navbar.
   - Choose any 1-Click Demo Preset (Amazon Cardboard, Newspapers, PET Bottles, Soda Cans, Glass, E-Waste) or upload your own image.
   - Observe computer vision classification: material category, confidence rating, current scrap rate (₹/kg), recyclability grade, and preparation tips.
   - Click **"Book Pickup with this Waste"**.

2. **Step 2: Proximity Pickup Request (Household)**
   - Material and quantity are automatically pre-populated.
   - Use the interactive OpenStreetMap picker or keep the default location.
   - Review the **Smart Proximity Matched Collector** (e.g. *Ramesh Kumar, 0.6 km away, 4.9★*).
   - Click **Confirm & Dispatch Pickup**.

3. **Step 3: Collector Acceptance & Dispatch (Kabadiwala)**
   - Switch to the **Kabadiwala** role in the top navbar.
   - Notice the incoming pickup alert in **Nearby Requests** or **Grouped Routes** (which clusters nearby pickups within 2.5 km).
   - Click **Accept Pickup** &rarr; status updates to `Accepted`.
   - Click **I am On The Way** &rarr; customer live tracking map updates in real time.

4. **Step 4: Digital Weighing & Transparent Calculation (Kabadiwala)**
   - Click **Digital Weigh & Complete**.
   - Use the interactive Bluetooth digital scale interface to enter actual verified weight (e.g. 12.5 kg).
   - System transparently applies the Admin rate (e.g. ₹14/kg) &rarr; **Net Payout = ₹175**.
   - Choose payment method (Instant UPI / Cash on Pickup) and click **Confirm Weighing & Issue Receipt**.

5. **Step 5: Digital Receipt & Recycler Inventory (Household & Recycler)**
   - A verifiable **Digital Receipt** pops up instantly with unique Receipt ID (`KC-2026-XXXX`), itemized breakdown, and environmental impact metrics (CO2 avoided, trees saved, water conserved).
   - Switch to **Recycler** role in the top navbar &rarr; the **Cardboard** inventory stock card immediately reflects the newly added +12.5 kg!
   - Switch to **Admin** role &rarr; adjust rates per kg dynamically or review the global audit ledger.

---

## 🏗 Architecture & Tech Stack

- **Frontend**: React 18 (TypeScript), Vite, Tailwind CSS, Lucide Icons, Leaflet (OpenStreetMap).
- **Backend**: Node.js, Express, TypeScript, RESTful API.
- **Persistence**: File-backed persistent JSON database (`server/src/data/db.json`) with auto-seeding.
- **AI Vision Engine**: Multi-modal computer vision feature extractor with confidence scoring and demo dataset.
- **Matching Engine**: Haversine distance proximity calculator with cluster route grouping.
