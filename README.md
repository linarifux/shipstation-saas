# ShipFlow 🚚📦  
**A MERN-based SaaS platform for advanced ShipStation automation and order management**

ShipFlow is a modern, scalable SaaS application built with the **MERN stack** (MongoDB, Express, React, Node.js) that integrates with the **ShipStation API** to automate shipments, manage products, visualize logistics data, and provide powerful analytics.

Designed for eCommerce brands, warehouses, and logistics teams who want more control, automation, and insights than standard ShipStation features provide.

---

## ✨ Features

### 📦 Shipments
- Fetch shipments via ShipStation API (v2)
- Advanced searchable & filterable table
- Row click → Full shipment details drawer
- Carrier, service, weight & status visibility
- Professional loading states (react-spinners)
- Dark-mode SaaS UI

### 🛍 Products
- Product listing & management
- Search and filter products
- Low inventory alerts
- Product detail drawer
- Modular architecture

### 🤖 Automation (Coming Soon)
- Auto-fill Custom Fields
- Smart rules based on country, SKU, weight
- Auto tagging + routing logic

### 📊 Analytics & Visualization
- Country-wise shipment stats
- Carrier comparison
- Heatmaps & reports (planned)

### 🧑‍💻 Admin & SaaS Ready
- Multi-user support
- Role-based access
- Billing-ready architecture
- SaaS-scalable design

---

## 🧱 Tech Stack

**Frontend**
- React
- TailwindCSS
- Axios
- React Router
- Lucide Icons
- react-spinners (loading animations)

**Backend**
- Node.js
- Express
- MongoDB (coming)
- ShipStation REST API v2

**Authentication**
- ShipStation uses Basic Auth (API Key + Secret)
- JWT coming for SaaS login

---

## ⚙️ Installation

### 1. Clone the Repository

git clone https://github.com/your-username/shipflow.git

cd shipflow

### 2. Install Dependencies

Frontend

cd client
npm install

Backend

cd server
npm install


🔐 Environment Variables

Create a .env file inside /server

SHIPSTATION_API_KEY=your_api_key

SHIPSTATION_API_SECRET=your_api_secret

PORT=5000

⚠️ Important: ShipStation requires both API Key & Secret for Basic Authentication.


▶️ Running the Project

Start Backend (Port 5000)

cd server

npm run dev

Start Frontend (Port 3000)


cd client

npm run dev


Now open:

http://localhost:3000


🔌 API Endpoints

GET /shipments

GET /products


More endpoints being added for:

Automation rules

Analytics

Bulk shipping tools

🧭 Roadmap

✅ Shipment dashboard

✅ Product management

✅ Drawer UI system

✅ Loading states

⏳ Pagination

⏳ Bulk actions

⏳ CSV export

⏳ AI automation rules

⏳ User auth & billing

⏳ Warehouse barcode scanning

💡 SaaS Vision

This project will become:

✅ A paid service for eCommerce brands

✅ A ShipStation automation layer

✅ A smart dashboard for 3PLs

✅ A competitor to ShipStation + ShipBob

👨‍💻 Author

Naimul Islam (Coffee and Code)

Full Stack Developer & eCommerce Automation Expert

