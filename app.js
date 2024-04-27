import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/login.html");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
