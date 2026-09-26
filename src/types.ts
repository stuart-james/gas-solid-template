import type * as api from "@api";

type ClientApi = typeof api;
type RunApi<
  TApi extends Record<string, (...args: any[]) => any>,
  TUserObject extends any = any,
> = {
  withSuccessHandler<TFnName extends keyof TApi>(
    handler: (
      value: ReturnType<TApi[TFnName]>,
      userObject: TUserObject,
    ) => void,
  ): RunApi<TApi, TUserObject>;
  withFailuerHandler(
    handler: (error: Error, userObject: TUserObject) => void,
  ): RunApi<TApi, TUserObject>;
  withUserObject<T>(userObject: T): RunApi<TApi, T>;
} & ClientApi;

declare global {
  var google: {
    script: {
      run: RunApi<ClientApi>;
    };
  };
}
