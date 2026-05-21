# 🚀 Welcome to Donor-Link! Quick Setup & Guidelines

Hey team! As you join the project, please follow these steps to keep our workflow synced and our history professional.

## 1. Initial Setup (The "mindlift" Remote)

We use **mindlift** as our primary remote name instead of the default `origin`. Please clone using this command:

```bash
git clone -o mindlift https://github.com/Mind-Lift-Ethiopia/Donor-Link
```

*(If you already cloned it, run: `git remote rename origin mindlift`)*

---

## 2. Post-Cloning Execution

Once you have cloned the project, follow these steps to get everything running locally:

### A. Environment Configuration
Copy the sample environment variables for both the API and the Web apps:
```bash
# In the root directory
cp apps/api/.env.example apps/api/.env
cp apps/national-ops-web/.env.example apps/national-ops-web/.env
```

### B. Install Dependencies
We use a monorepo structure. Install all dependencies from the root:
```bash
npm install
```

### C. Run the Core Platform (API & Frontend)
```bash
npm run dev
```

### D. Run the ML Service (FastAPI)
The internal intelligence microservice runs separately:
```bash
cd apps/ml
# Activate the virtual environment
source .venv/Scripts/activate  # Bash
# .venv\Scripts\activate.bat   # CMD (Windows)

# Run the service
uvicorn app.main:app --reload --port 8000
```

---

## 3. Branching & Workflow

### 🚩 Critical: Switch to Your Own Branch
Immediately after setup, swap from `main` to your personal feature branch using the following format:
**`yourname`**

```bash
git checkout -b john
```

### Pulling the Latest Changes (Fetch & Merge)
To keep your local work synced with the team, follow this specific process:
1. **Fetch** updates from the mindlift remote:
   ```bash
   git fetch mindlift
   ```
2. **Merge** the remote branch into your local branch:
   ```bash
   git merge mindlift/main
   ```
3. **Push** to your own personal branch:
   ```bash
   git push mindlift john
   ```

---

## 4. Commit Message Standards

We follow the **Conventional Commits** style to ensure a clean history.
Format: `type(scope): short description`

- **feat**: A new feature (e.g., `feat(forms): add donor registration`)
- **fix**: A bug fix (e.g., `fix(api): resolve data fetch error`)
- **refactor**: Code refinement (e.g., `refactor(table): extract pagination logic`)
- **chore**: Maintenance (e.g., `chore(deps): update tailwindcss`)
- **style**: UI spacing or formatting (e.g., `style(theme): update primary colors`)

💡 **Pro-tip**: Keep commits atomic and meaningful!

Let’s build something great! 🧠✨
