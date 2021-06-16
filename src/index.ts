import express from "express";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!" + (new Date().toISOString()));
});

app.get("/e", () => {
  throw new Error('DEV');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
