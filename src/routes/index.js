/* @flow */
"use strict";

import root from "./root";

export default app => {
    app.use("/", root);
};
