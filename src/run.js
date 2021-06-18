import Q from "q";
import redis from "redis";
import url from "node:url";
import storage from "./storage/redis-store.js";
import server from "./server.js";
// import git from "git-rev-sync";
Q.longStackSupport = true;

import dotenv from "dotenv-extended";

dotenv.load();

var redisParameter = process.env["REDISCLOUD_URL"];
if (redisParameter !== "") {
  var redisURL = url.parse(redisParameter);
  var client = redis.createClient(redisURL.port, redisURL.hostname, {
    no_ready_check: true,
  });
  if (redisURL.auth) {
    client.auth(redisURL.auth.split(":")[1]);
  }
} else {
  var client = null;
}

var res = Q.fcall(function (database) {
  server.start(
    {
      development: process.env["NODE_ENV"] !== "production",
      baseUrl: process.env["BASE_URL"],
      logURL: process.env["LOG_URL"],
      gitRev: process.env["GIT_REV"], // || git.short(),
      gitBranch: process.env["GIT_BRANCH"], // || git.branch(),
      port: process.env["PORT"],
      sessionSecret: process.env["SESSION_SECRET"],
      db: storage.makeStorage(client),
      google: {
        apiKey: process.env["GOOGLE_API_KEY"],
        clientId: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        redirect: "/oauth2callback",
      },
      version: process.env["CURRENT_PYRET_RELEASE"],
      pyret: process.env["PYRET"],
    },
    function (app) {
      console.log("Server ready.");
    }
  );
});
res.fail(function (error) {
  console.error("Server did not start:", error);
});
