# 🚀 Running the DonorLink Ecosystem

This guide provides step-by-step instructions for running the full-stack DonorLink platform, including the Node.js monorepo and the FastAPI ML microservice.

---

## 1. Running the Core Platform (Node.js & React)

The core applications are managed using **Turborepo**. You can run the Express API and all React frontends (National Ops, Hospital Portal, Donor Platform) from the root directory.

### Commands for Root Directory
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run all apps in Development mode**:
   ```bash
   # This will start the API on port 5000 and the web apps on their respective ports
   npm run dev
   ```

---

## 2. Running the ML Intelligence Service (FastAPI)

The ML service is a Python application located in `apps/ml`. It requires a virtual environment and specific activation depending on your shell.

### A. Using Git Bash (MINGW64) / Linux / macOS
1. **Navigate to the ML directory**:
   ```bash
   cd apps/ml
   ```
2. **Activate the Virtual Environment** (Source is critical!):
   ```bash
   source .venv/Scripts/activate
   ```
3. **Run the Service**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### B. Using Windows CMD (Command Prompt)
1. **Navigate to the ML directory**:
   ```cmd
   cd apps\ml
   ```
2. **Activate the Virtual Environment**:
   ```cmd
   .venv\Scripts\activate.bat
   ```
3. **Run the Service**:
   ```cmd
   uvicorn app.main:app --reload --port 8000
   ```

### C. Using Windows PowerShell
1. **Navigate to the ML directory**:
   ```powershell
   cd apps\ml
   ```
2. **Activate the Virtual Environment**:
   ```powershell
   & .\.venv\Scripts\Activate.ps1
   ```
3. **Run the Service**:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```

---

## 💡 Troubleshooting
- **ModuleNotFoundError (pydantic_settings)**: Ensure you have activated the virtual environment using `source` (Bash) or `.bat` (CMD). If the error persists, run `pip install -r requirements.txt` inside the activated environment.
- **Port Conflicts**: Ensure port `5000` (API) and `8000` (ML) are not in use by other applications.
- **Backend Communication**: The Node.js API expects the ML service at `http://localhost:8000`. Ensure the ML service is running before using intelligence features in the frontend.
