import { ReadStream } from "node:fs";
import { Next, ParameterizedContext } from "koa";

// @region-begin shape

interface MiddlewareOptions {}

// @region-end

// @region-begin function

/**
 * Convert {@link ReadStream} to string.
 */
function readStreamToString(stream: ReadStream): Promise<string> {
  const chunks: Array<Buffer> = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

// @region-end

// @region-begin main

const transpiler = new Bun.Transpiler({
  loader: "ts",
});

/**
 * Create the middleware using options.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createMiddleware = (options: MiddlewareOptions) => {
  return async (ctx: ParameterizedContext, next: Next) => {
    await next();

    if (!ctx.response.is("ts")) {
      return;
    }

    const responseBody: unknown = ctx.response.body;
    if (typeof responseBody === "string") {
      const transformedCode = await transpiler.transform(responseBody);
      ctx.response.body = transformedCode;
      ctx.response.type = "text/javascript";
    } else if (responseBody instanceof Uint8Array) {
      const transformedCode = await transpiler.transform(responseBody);
      ctx.response.body = transformedCode;
      ctx.response.type = "text/javascript";
    } else if (responseBody instanceof ReadStream) {
      const initialCode = await readStreamToString(responseBody);
      const transformedCode = await transpiler.transform(initialCode);
      ctx.response.body = transformedCode;
      ctx.response.type = "text/javascript";
    } else {
      throw new Error(
        `Not supported! response.body type '${responseBody?.constructor.name}'`,
      );
    }
  };
};

// @region-end

export { createMiddleware, type MiddlewareOptions };
export default createMiddleware;
