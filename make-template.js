import mustache from "mustache";
import file from "node:fs";

import dotenv from "dotenv-extended";

dotenv.load();

var config = process.env;

var fileIn = process.argv[2];
var fileContents = String(file.readFileSync(fileIn));

process.stdout.write(mustache.render(fileContents, config));
