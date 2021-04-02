const fs = require("fs"),
    path = require("path"),
    PATH_OPT = path.join(__dirname, "..", "api", "core", "options.json"),
    OPTIONS = JSON.parse(
        fs.readFileSync(PATH_OPT, "utf8")
    );
module.exports = {
    OPTIONS,
    PATH_OPT,
    fs
};