"use strict";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes";
import { PORT, IP, DB_URL } from "./config";

const app = express();

// connect to database
mongoose.connect(DB_URL);

/* setup middlewares */

// log incoming requests for debugging
app.use(morgan("combined"));

// try to parse every incoming requests as json no matter what the type of the
// requests is
app.use(bodyParser.json({type: "*/*"}));

routes(app);

const server = app.listen(PORT, IP, () => {
    console.log(`Server listening at ${IP}:${PORT}`);
});
