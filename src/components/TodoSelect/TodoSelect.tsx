import { useState } from 'react';

import cn from 'classnames';

import { useCustomContext } from '../../helpers/context/customContext';
import { SelectedTodo } from '../../helpers/enums/SelectedTodoEnum';

export const TodoSelecet = () => {
  const {
    isTodoSelected,
    onIsTodoSelected,
  } = useCustomContext();

  const [defaultActiveSelect, onDefaultActiveSelect] = useState(true);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          'filter__link selected': defaultActiveSelect,
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          onIsTodoSelected(SelectedTodo.all);
          onDefaultActiveSelect(true);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          'filter__link selected': SelectedTodo.active === isTodoSelected,
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          onIsTodoSelected(SelectedTodo.active);
          onDefaultActiveSelect(false);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          'filter__link selected': SelectedTodo.completed === isTodoSelected,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          onIsTodoSelected(SelectedTodo.completed);
          onDefaultActiveSelect(false);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
