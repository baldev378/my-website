const express = require("express");
const app = express();
const PORT = 3000

app.get("/", function(req, res) {
    res.send("Hello my backend is working");
});

app.listen(PORT, function() {
    console.log("Server running at http://localhost:" + PORT);
});
