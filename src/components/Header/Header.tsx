import cn from 'classnames';

import { TodoForm } from '../TodoForm/TodoForm';

import { useCustomContext } from '../../helpers/context/customContext';

export const Header = () => {
  const { todos, toggleAll } = useCustomContext();

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}

      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <TodoForm />
    </header>
  );
};
