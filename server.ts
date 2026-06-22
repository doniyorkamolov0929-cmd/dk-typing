import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// file-backed database of user rankings to allow multi-device live sync
const RANKINGS_FILE = path.join(process.cwd(), "rankings.json");

function loadRankings() {
  if (fs.existsSync(RANKINGS_FILE)) {
    try {
      const data = fs.readFileSync(RANKINGS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (_) {
      return {};
    }
  }
  return {};
}

function saveRankings(data: any) {
  try {
    fs.writeFileSync(RANKINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (_) {}
}

// API Routes
app.get("/api/rankings", (req, res) => {
  const rankings = loadRankings();
  const list = Object.values(rankings);
  res.json({ list });
});

app.post("/api/rankings", (req, res) => {
  const { id, fullName, wpm, totalStars, streak } = req.body;
  if (!id || !fullName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const rankings = loadRankings();
  rankings[id] = {
    id,
    fullName,
    wpm: Number(wpm) || 0,
    totalStars: Number(totalStars) || 0,
    streak: Number(streak) || 0,
    updatedAt: Date.now()
  };
  saveRankings(rankings);
  res.json({ success: true, updated: rankings[id] });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
