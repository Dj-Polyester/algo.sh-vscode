const { DEBUG } = require("../debug");
const { OPTIONS } = require("../core");
const express = require("express");
const router = new express.Router();

router.get("/options", async (req, res) => {
    const { txt, start, end } = req.params;
    try {
        res.send(OPTIONS);
    } catch (error) {
        DEBUG(error);
    }
});

module.exports = router;