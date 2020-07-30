import * as http from "http";
import fs = require("fs");

const blacklist: Map<string, number> = new Map();
const packet: string = "server|127.0.0.1\nport|17091\ntype|1\n#maint|Mainetrance message (Not used for now) -- NodeJS-GTPS\n\nbeta_server|127.0.0.1\nbeta_port|17091\n\nbeta_type|1\nmeta|localhost\nRTENDMARKERBS1001";
const files: Map<string, Buffer> = new Map();

for (let file of fs.readdirSync(`${__dirname}/assets`)) {
    if (!file.endsWith(".rrtex")) continue;
    files.set(file, fs.readFileSync(`${__dirname}/assets/${file}`));
};

const timeout: number = 10000;

function add_address(address: string) {
    blacklist.set(address, Date.now() + 10000);
}

let server = http.createServer(function(req, res) {
    let url = req.url.split("/growtopia/")[1];  
    if (url && url.startsWith("server_data.php") && req.method.toLowerCase() === "post") {
        console.log(`Connection from: ${req.connection.remoteAddress}`);
        if (!blacklist.has(req.connection.remoteAddress + req.url)) {
            console.log(`${req.connection.remoteAddress} is now the in the blacklist for ${timeout / 1000} seconds. at route: ${req.url}`)
            add_address(req.connection.remoteAddress + req.url)
        } else {
            let not_allowed = blacklist.get(req.connection.remoteAddress + req.url);
            if (Date.now() > not_allowed) {
                console.log(`Timeout done for: ${req.connection.remoteAddress}`);
                blacklist.delete(req.connection.remoteAddress + req.url);
            } else {
                console.log(`Connection blocked: ${req.connection.remoteAddress}`);
                return req.connection.destroy();
            }
        }

        console.log(`Entered correct route: ${req.connection.remoteAddress}`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(packet, (err) => {
            if (err)
                console.log(err);

            res.end();
            res.destroy();
        });
    } else if (url && files.has(url.replace(/\//g, "")) && req.method.toLowerCase() === "get") {
        console.log(`Connection from: ${req.connection.remoteAddress}`);
        if (!blacklist.has(req.connection.remoteAddress + req.url)) {
            console.log(`${req.connection.remoteAddress} is now the in the blacklist for ${timeout / 1000} seconds. at route: ${req.url}`)
            add_address(req.connection.remoteAddress + req.url)
        } else {
            let not_allowed = blacklist.get(req.connection.remoteAddress + req.url);
            if (Date.now() > not_allowed) {
                console.log(`Timeout done for: ${req.connection.remoteAddress}`);
                blacklist.delete(req.connection.remoteAddress + req.url);
            } else {
                console.log(`Connection blocked: ${req.connection.remoteAddress}`);
                return req.connection.destroy();
            }
        }

        // rrtex file exist
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            "Content-Disposition": "attachment; filename=" + !url.endsWith(".rrtex") ? url + ".rrtex" : url
        });

        res.write(files.get(url), (err) => {
            if (err)
                console.log(err);

            res.end();
            res.destroy();
        });
    } else {
        console.log(`Connection blocked: ${req.connection.remoteAddress}`);
        res.destroy();
    }
});

server.listen(80);

server.on("connection", (socket) => {
    
});

server.on("listening", () => console.log("HTTP Server now up."));
