// Assuming this file is in 'test/TodoList.test.tsx' or similar
import { render } from '../src/index';
import { TodoList } from './fixtures/TodoList';
import { describe, expect, test } from 'vitest';

describe('<TodoList />', () => {
    test('it will render an text input and a button', async () => {
        const screen = render(<TodoList />);

        await expect.element(screen.getByPlaceholder('new todo here')).toBeVisible();
        await expect.element(screen.getByRole('button', { name: /Add Todo/i })).toBeVisible();
    });

    test('it will add a new todo', async () => {
        const screen = render(<TodoList />);

        const inputLocator = screen.getByPlaceholder('new todo here');
        const buttonLocator = screen.getByRole('button', { name: /Add Todo/i });

        await inputLocator.fill('test new todo');

        await buttonLocator.click();

        await expect.element(inputLocator).toHaveValue('');

        await expect.element(screen.getByText(/test new todo/)).toBeVisible();
    });

    test('it will mark a todo as completed', async () => {
        const screen = render(<TodoList />);
        const inputLocator = screen.getByPlaceholder('new todo here');
        const buttonLocator = screen.getByRole('button', { name: /Add Todo/i });

        const todoText = "mark new todo as completed";
        await inputLocator.fill(todoText);
        await buttonLocator.click();

        const checkboxLocator = screen.getByRole('checkbox', { name: todoText }); // Assuming label links text and checkbox

        await expect.element(checkboxLocator).not.toBeChecked();

        await checkboxLocator.click();

        await expect.element(checkboxLocator).toBeChecked();

        const textLocator = screen.getByText(/mark new todo as completed/);

        await expect.element(textLocator).toHaveStyle({
            textDecoration: 'line-through',
        });

    });
});