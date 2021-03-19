const {
    pool,
    DBNAME,
    ISTHEREANYDB,
    CREATEDB,
    DROPDB,
    ISTHEREANYTABLE,
    CREATETABLE,
    DROPTABLE,
    INSERTINTO,
    GETENTRIES,
} = require("./db"),
    db = require("./db"),
    { DEBUG } = require("./debug"),
    core = require("./core"),
    { OPTIONS } = require("./core");

(async function () {
    try {
        console.time("GET");
        const res = await db.GET("floyd", 8, 10);
        if (res.rowCount === 0) {
            const codes = await core.getReq("floyd", 8, 10);
            await db.PUT("floyd", 8, 10, codes);
            console.log(codes);;
        } else console.log(res.rows.map(x => x.lines));
    } catch (error) {
        DEBUG(error);
    } finally {
        console.timeEnd("GET");
        await pool.end();
    }
})();