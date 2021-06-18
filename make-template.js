import mustache from "mustache";
import file from "node:fs";

import dotenv from "dotenv";
// Silent suppresses "missing .env file" warning,
// which we want since deploys don't have that file
dotenv.config();

var config = process.env;

var fileIn = process.argv[2];
var fileContents = String(file.readFileSync(fileIn));

process.stdout.write(mustache.render(fileContents, config));
