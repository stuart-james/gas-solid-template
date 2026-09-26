/* @refresh reload */
/* @jsxImportSource solid-js */
import { render } from "solid-js/web";
import "solid-devtools";
import {createServerFn} from "./api/run-polyfill.ts"
import App from "./App";

const root = document.getElementById("root");

console.log(await createServerFn("hello")("friend"))

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => <App />, root!);
