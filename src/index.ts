import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})