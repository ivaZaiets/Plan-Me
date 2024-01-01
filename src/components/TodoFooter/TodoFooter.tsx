import { useCustomContext } from '../../helpers/context/customContext';

import { TodoSelecet } from '../TodoSelect/TodoSelect';

export const TodoFooter = () => {
  const {
    todos,
    completedTodos,
    deleteCompletedTodos,
  } = useCustomContext();

  const todosCounter = todos.filter(todo => todo.completed !== true).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <TodoSelecet />

      {/* eslint-disable jsx-a11y/control-has-associated-label */}

      <button
        disabled={completedTodos.length === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteCompletedTodos(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
