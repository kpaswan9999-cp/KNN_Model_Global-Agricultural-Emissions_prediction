# 🌍 EcoPredict AI: Agricultural Emissions Predictor

EcoPredict AI is a sophisticated Machine Learning platform designed to predict and analyze agricultural greenhouse gas emissions across the globe. Using a K-Nearest Neighbors (KNN) classification model, the application identifies dominant emission types (CO2, CH4, N2O) based on historical data from the Food and Agriculture Organization (FAO).

![EcoPredict Dashboard](https://raw.githubusercontent.com/kpaswan9999-cp/KNN_Model_Global-Agricultural-Emissions_prediction/main/frontend/public/favicon.png)

## 🚀 LIVE DEPLOYMENT
- **Frontend (Vercel)**: [https://knn-model-global-agricultural-emiss.vercel.app/](https://knn-model-global-agricultural-emiss.vercel.app/)
- **Backend (Render)**: [https://knn-model-global-agricultural-emissions.onrender.com/](https://knn-model-global-agricultural-emissions.onrender.com/)

---

## 🔥 Key Features
- **Real-time AI Inference**: Predict emission types using a trained KNN model with high accuracy.
- **Interactive Analytics**: Visualize global emission trends, top-emitting countries, and elemental distributions via dynamic charts.
- **Persistent History**: Track your previous predictions locally in your browser with the ability to "View Again" or audit your analysis.
- **Eco-Techno Aesthetic**: A premium dark-mode UI featuring glassmorphism, advanced particle animations, and high-fidelity custom assets.
- **Deployment-Ready**: Optimized for decoupled hosting on Vercel and Render.

---

## 🛠️ Technology Stack
### **Frontend**
- **React 18** (Vite-powered)
- **Tailwind CSS v4** (Modern logic and styling)
- **Framer Motion** (Subtle micro-animations)
- **Lucide-React** (Contextual iconography)
- **tsparticles** (Interactive background network)
- **Axios** (API communication)

### **Backend**
- **Flask** (Python REST API)
- **Scikit-Learn** (KNN Classifier & Preprocessing)
- **Pandas/NumPy** (Data manipulation)
- **Gunicorn** (Production-grade GSGI server)

---

## 📂 Project Structure
```text
├── backend/            # Flask REST API
│   ├── app.py          # Main entry point
│   ├── model.pkl       # Trained KNN Model
│   ├── scaler.pkl      # Feature Scaler
│   ├── metadata.json   # Mapping of categories and target classes
│   └── requirements.txt
├── frontend/           # React + Vite Application
│   ├── src/            # Components, Pages, and Assets
│   ├── public/         # Icons and Background Meshes
│   └── vercel.json     # SPA routing configuration
└── README.md
```

---

## ⚙️ Local Development Setup

### **1. Clone the repository**
```bash
git clone https://github.com/kpaswan9999-cp/KNN_Model_Global-Agricultural-Emissions_prediction.git
cd KNN_Model_Global-Agricultural-Emissions_prediction
```

### **2. Setup Backend**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # On Windows
pip install -r requirements.txt
python app.py
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📡 Deployment Configuration

### **Backend (Render)**
1. Create a **Web Service**.
2. Set **Root Directory** to `backend`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `gunicorn app:app`.

### **Frontend (Vercel)**
1. Create a **New Project**.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable: `VITE_API_URL` = `[YOUR_RENDER_URL]/api`.

---

## 📜 License
This project was developed for educational and research purposes in agricultural sustainability.

**Developed with ❤️ by [K Paswan]**
