const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", auth, role("ADMIN"), (req, res) => {
    res.json({ message: "Admin access granted" });
});

module.exports = router;