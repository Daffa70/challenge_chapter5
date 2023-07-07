const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const morgan = require("morgan");

app.use(morgan("dev")); //middleware logging
app.use(express.json()); //middleware body
app.use(cors());

const file = fs.readFileSync("./docs.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

const router = require("./routes");
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  return res.status(404).json({
    message: `cant find ${req.url}`,
  });
  next();
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

app.listen(port, () => console.log("running on port", port));
