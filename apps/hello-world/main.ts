import Koa from "koa";
import serve from "koa-static";
import createTypeScriptMiddleware from "koa-middleware-sst-typescript";

const port = 8080;
const root = "./app";
const opts = {};

const typeScriptMiddleware = createTypeScriptMiddleware();

const app = new Koa();
app.use(typeScriptMiddleware);
app.use(serve(root, opts));
app.listen(port);
