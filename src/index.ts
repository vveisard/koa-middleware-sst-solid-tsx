import { DefaultContext, DefaultState, Next, ParameterizedContext } from "koa";

interface SstMiddlewareOptions<
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = unknown,
  TransformedResponseBodyT extends ResponseBodyT = ResponseBodyT,
> {
  /**
   * Determine if the middleware should run.
   * Run after `next` is invoked.
   */
  readonly shouldTransform: (
    ctx: ParameterizedContext<StateT, ContextT, ResponseBodyT>,
  ) => boolean;

  /**
   * Transform the body of the response.
   */
  readonly doTransform: (
    ctx: ParameterizedContext<StateT, ContextT, ResponseBodyT>,
  ) => TransformedResponseBodyT;
}

/**
 * Create the sst middleware using options.
 */
const createSstMiddleware = <
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = unknown,
  TransformedResponseBodyOutputT extends ResponseBodyT = ResponseBodyT,
>(
  options: SstMiddlewareOptions<
    StateT,
    ContextT,
    ResponseBodyT,
    TransformedResponseBodyOutputT
  >,
) => {
  return async (
    ctx: ParameterizedContext<StateT, ContextT, ResponseBodyT>,
    next: Next,
  ) => {
    await next();

    const shouldTransform = options.shouldTransform(ctx);
    if (!shouldTransform) {
      return;
    }

    const transformedResponseBody = options.doTransform(ctx);

    ctx.response.body = transformedResponseBody;
  };
};

export { createSstMiddleware, type SstMiddlewareOptions };
