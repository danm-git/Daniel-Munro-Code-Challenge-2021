const { server } = require("./src/config/config");
const express = require("express");
const app = express();
const opReturnRoutes = require("./src/op_return/routes");
const port = server.port;

app.use("/opreturn/", opReturnRoutes);

app.use(express.json());

app.get("/admin", (req, res) => {
  res.sendFile(`${__dirname}/src/public/adminPage.html`);
});

app.listen(port, () => console.log("Listening on port " + port));
