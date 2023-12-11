//
import { expect, it, describe, mock } from "bun:test";
import { Next, type Context } from "koa";
//
import {
  createSstMiddleware,
  type SstMiddlewareOptions,
} from "../src/index.ts";

describe("SstMiddleware", () => {
  // white box
  it("invokes next when shouldTransform returns true", async () => {
    const shouldTransform = () => true;
    const doTransform = () => undefined;
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: doTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const mockNext: Next = mock(() => Promise.resolve());

    await middleware(ctx, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  // white box
  it("invokes next when shouldTransform returns false", async () => {
    const shouldTransform = () => false;
    const doTransform = () => undefined;
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: doTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const mockNext: Next = mock(() => Promise.resolve(undefined));

    await middleware(ctx, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  // white box
  it("should invoke doTransform when shouldTransform returns true", async () => {
    const shouldTransform = () => true;
    const mockDoTransform = mock(() => undefined);
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: mockDoTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const next: Next = () => Promise.resolve(undefined);
    await middleware(ctx, next);

    expect(mockDoTransform).toHaveBeenCalled();
  });

  // white box
  it("should not invoke doTransform when shouldTransform returns false", async () => {
    const shouldTransform = () => false;
    const mockDoTransform = mock(() => undefined);
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: mockDoTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const mockNext: Next = () => Promise.resolve(undefined);

    middleware(ctx, mockNext);

    expect(mockDoTransform).not.toHaveBeenCalled();
  });

  // black box
  it("should set ctx.response.body to the result of doTransform when shouldTransform returns true", async () => {
    const doTransformResult = {};
    const doTransform = () => doTransformResult;
    const shouldTransform = () => true;
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: doTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const next = () => Promise.resolve();

    await middleware(ctx, next);

    expect(ctx.response.body).toBe(doTransformResult);
  });

  // black box
  it("should not set ctx.response.body when shouldTransform returns false", async () => {
    const doTransformResult = {};
    const doTransform = () => doTransformResult;
    const shouldTransform = () => false;
    const middlewareOptions: SstMiddlewareOptions = {
      doTransform: doTransform,
      shouldTransform: shouldTransform,
    } as SstMiddlewareOptions;
    const middleware = createSstMiddleware(middlewareOptions);

    const ctx: Context = { response: {} } as Context;
    const next = () => Promise.resolve();

    await middleware(ctx, next);

    expect(ctx.response.body).toBe(undefined);
  });
});
