import dotenv from "dotenv";
import express from "express";
import videoRoutes from "./routes/videos.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.use("/videos", videoRoutes);

app.get("/", (req, res) => {
    res.send("Hello there!!!");
});

// Start Express server on port 8080
app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});
