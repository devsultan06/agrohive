import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req: express.Request, res: express.Response) => {
  console.log("Hello World22224444222!");
  res.send("Hello World2266444444666333!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
