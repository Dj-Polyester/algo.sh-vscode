const { DEBUG } = require("../debug");
const core = require("../core");
const express = require("express");
const router = new express.Router();

router.get("/code/:txt/:start/:end", async (req, res) => {
    const { txt, start, end } = req.params;
    try {
        console.time("GET");
        res.send(await core.GET(txt, start, end));
        console.timeEnd("GET");
    } catch (error) {
        DEBUG(error);
    }
});

module.exports = router;