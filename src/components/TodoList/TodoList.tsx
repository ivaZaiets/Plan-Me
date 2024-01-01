import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { UpdatingForm } from '../UpdatingForm/UpdatingForm';

import { useCustomContext } from '../../helpers/context/customContext';

export const TodoList = () => {
  const {
    copyOfTodos,
    updatingForm,
    tempTodo,
  } = useCustomContext();

  return (
    <>
      {copyOfTodos.map(todo => (
        <React.Fragment key={todo.id}>
          {updatingForm?.id === todo.id ? (
            <UpdatingForm
              todo={todo}
            />
          ) : (
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          )}
        </React.Fragment>
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </>
  );
};
