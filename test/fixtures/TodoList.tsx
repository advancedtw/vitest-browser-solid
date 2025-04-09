import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";

type Todo = { id: number; text: string; completed: boolean };

/**
 * A simple todo list.
 *
 * @returns A JSX element displaying a todo list and a form to add new todos.
 */
export const TodoList: Component = () => {
    let input!: HTMLInputElement;
    const [todos, setTodos] = createStore<Todo[]>([]);
    const addTodo = (text: string) => {
        setTodos(todos.length, { id: todos.length, text, completed: false });
    };
    const toggleTodo = (id: number) => {
        setTodos(id, "completed", (c) => !c);
    };

    return (
        <>
            <div>
                <input placeholder="new todo here" ref={input} />
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                    onClick={() => {
                        if (!input.value.trim()) return;
                        addTodo(input.value);
                        input.value = "";
                    }}
                >
                    Add Todo
                </button>
            </div>
            <div>
                <For each={todos}>
                    {(todo) => {
                        const { id, text } = todo;
                        return (
                            <div>
                                <input type="checkbox" checked={todo.completed} onchange={[toggleTodo, id]} aria-label={todo.text} />
                                <span
                                    style={{
                                        "text-decoration": todo.completed ? "line-through" : "none",
                                    }}
                                >
                                    {text}
                                </span>
                            </div>
                        );
                    }}
                </For>
            </div>
        </>
    );
};
