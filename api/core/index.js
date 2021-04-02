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
} = require("../db"),
    {
        DEBUG,
        DEBUGARR,
    } = require("../debug"),
    https = require("https"),
    { parse } = require("node-html-parser"),
    { OPTIONS, PATH_OPT, fs } = require("./options"),
    db = require("../db");
function saveOpt() {
    try {
        fs.writeFileSync(PATH_OPT, JSON.stringify(OPTIONS));
    } catch (error) {
        return DEBUG(error);
    }
}
/**
 * @param {string} txt the text in the search bar
 * @param {number} start starting offset (included)
 * @param {number} end ending offset (excluded)
 * @returns array of codes
 */
async function GET(txt, lang, start, end) {
    const client = await pool.connect();
    try {
        const tmpres = await client.query(ISTHEREANYTABLE);
        if (tmpres.rowCount === 0) {
            await client.query(CREATETABLE);
        }

        const res = await db.GET(txt, lang, start, end);
        if (res.rowCount !== OPTIONS.load) {
            const codes = await getReq(txt, lang, start, end);
            await db.PUT(txt, lang, start, end, codes);
            return codes;
        } else return res.rows.map(x => x.lines);
    } catch (error) {
        DEBUG(error);
    } finally {
        client.release();
    }
}

async function getReq(txt, lang, start, end) {
    let promises = [];
    for (let index = start; index < end; index++) {
        promises.push(new Promise((resolve, reject) => {
            https.get(`https://cht.sh/${lang}/${txt}/${index}`, async res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {
                    // get a single code in a document
                    let lines = [];
                    const root = parse(data);
                    // const linesTxt = root.querySelector("pre").childNodes[0].rawText; //same but slower
                    const linesTxt = root.childNodes[0].childNodes[3].childNodes[6].childNodes[0].rawText; //same but faster
                    delete root;
                    const newRoot = parse(linesTxt);
                    delete linesTxt;
                    const childnodes = newRoot.childNodes;
                    delete newRoot;
                    for (const childNode of childnodes) {
                        const line = childNode.text;
                        lines.push(line);
                    }
                    resolve(lines);
                });

            }).on("error", (error) => {
                DEBUG(error);
                reject(error);
            }).end();
        }));
    }
    return Promise.all(promises);
}

module.exports = {
    getReq,
    saveOpt,
    PATH_OPT,
    OPTIONS,
    GET,
};