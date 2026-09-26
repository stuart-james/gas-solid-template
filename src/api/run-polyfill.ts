import type * as api from "@api";

type ClientApi = typeof api;
export function createServerFn<T extends keyof ClientApi>(fn: T) {
  return async (...parameters: Parameters<ClientApi[T]>) => {
    const res: {
      ok: true;
      value?: ReturnType<ClientApi[T]>;
      error?: string;
    } = await fetch("/api/gas", {
      method: "POST",
      body: JSON.stringify({
        function: fn,
        parameters,
      }),
    })
      .then((r) => {
        console.log(r);
        return r.json();
      })
      .catch((e) => {
        throw new Error(
          `Unexpected error while running server function ${fn}: ${e instanceof Error ? e.message : e}`,
        );
      });
    if (res.error) {
      console.log(res.error);
      throw new Error(`Server function error: ${JSON.stringify(res.error)}`);
    }
    return res.value!;
  };
}
