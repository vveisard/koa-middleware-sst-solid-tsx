import Koa from "koa";
import serve from "koa-static";
import createSolidTsxSstMiddleware from "koa-middleware-sst-solid-tsx";

const port = 8080;
const root = "./app";
const opts = {};

const solidTsxSstMiddleware = createSolidTsxSstMiddleware();

const app = new Koa();
app.use(solidTsxSstMiddleware);
app.use(serve(root, opts));
app.listen(port);
