import type * as api from "../../../server/api";
type ClientApi = typeof api

export function createServerFn<T extends keyof ClientApi>(
  fn: T,
): (...args: Parameters<ClientApi[T]>) => Promise<ReturnType<ClientApi[T]>> {
  return (...args: Parameters<ClientApi[T]>) =>
    new Promise<ReturnType<ClientApi[T]>>((resolve, reject) => {
      const runObj = google.script.run
        .withFailuerHandler((e) => {
          reject(e);
        })
        .withSuccessHandler<T>((r) => {
          resolve(r);
        });
      (runObj[fn] as any)(...args);
    });
}
