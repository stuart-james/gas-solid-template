import {
  createResource,
  type Component,
  Switch,
  Match,
  Suspense,
  createEffect,
} from "solid-js";
import Comp from "./Comp";
const getAuthStatus = (): Promise<{
  authenticated: boolean;
  authUrl?: string;
}> =>
  fetch("/api/auth/status").then((r) => {
    if (!r.ok) {
      throw new Error("Not ok! " + r.statusText);
    }
    const json = r.json();
    return json
  });

const App: Component = () => {
  return (
    <Suspense fallback={"loading..."}>
      <AuthOrApp />
    </Suspense>
  );
};

function AuthOrApp() {
  const [status, s] = createResource(getAuthStatus);
  createEffect(() => {
    console.log(status())
  })
  return (
    <Switch fallback="Something went wrong!">
      <Match when={status()?.authenticated}>
        <h1>App</h1>
      </Match>
      <Match when={status()?.authUrl}>
        {(url) => <a href={url()}>Authenticate</a>}
      </Match>
    </Switch>
  );
}

export default App;
