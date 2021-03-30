const { DEBUG } = require("../debug");
const core = require("../core");
const express = require("express");
const router = new express.Router();

router.get("/code/:txt/:lang/:start/:end", async (req, res) => {
    const { txt, lang, start, end } = req.params;
    try {
        console.time("GET");
        res.send(await core.GET(txt, lang, start, end));
        console.timeEnd("GET");
    } catch (error) {
        DEBUG(error);
    }
});

module.exports = router;