import { JSX } from "solid-js";

export function HelloWorld({ name }: { name: string }): JSX.Element {
    return <div>Hello {name}</div>
}
