import express from "express";

const port = parseInt(process.env.PORT) || 3000;
const app = express();

app.get("/health", (req, res) => {
  res.send("Success");
});

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

export default app;
