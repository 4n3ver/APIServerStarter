/* @flow */
"use strict";

const path = require("path");
const fs = require("fs");

let nodeModules = {};
fs.readdirSync("node_modules")
  .filter((x) => [".bin"].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = "commonjs " + mod);

module.exports = [
    {
        name     : "Server Build",
        entry    : path.resolve(__dirname, "src/app-server.js"),
        output   : {
            path    : path.join(__dirname, "build"),
            filename: "app-server.js"
        },
        externals: nodeModules,
        target   : "node",
        module   : {
            loaders: [
                {
                    test          : /\.js$/,
                    exclude       : /(node_modules)/,
                    loader        : "babel-loader",
                    cacheDirectory: true,
                    query         : {
                        presets: [
                            "es2015"
                        ],
                        plugins: [
                            "transform-flow-strip-types"
                        ]
                    }
                }
            ]
        },
        node     : {
            console   : true,
            global    : true,
            process   : true,
            Buffer    : true,
            __filename: false,
            __dirname : false
        },
        devtool  : "source-map"
    }
];
