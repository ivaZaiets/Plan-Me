import React, { useEffect, useRef } from 'react';

import { USER_ID } from '../../helpers/userId';

import { useCustomContext } from '../../helpers/context/customContext';

import { Todo } from '../../types/Todo';

import * as dataOperations from '../../api/todos';

export const TodoForm = () => {
  const {
    updateInputFocus,
    isInputDisabled,
    query,
    deleteCompletedTodos,
    deleteTodos,
    onQuery,
    onErrorMessage,
    onTempTodo,
    onIsTodoLoading,
    onIsInputDisabled,
    onTodos,
  } = useCustomContext();

  const addTodos = ({ userId, title, completed }: Todo) => {
    onErrorMessage('');

    const temporaryTodo = {
      userId,
      title,
      completed,
      id: 0,
    };

    onTempTodo(temporaryTodo);
    onIsTodoLoading(temporaryTodo);
    onIsInputDisabled(true);

    return dataOperations.addTodos({ userId, title, completed })
      .then(todo => {
        onTodos(
          prev => [...prev, todo],
        );
      })
      .catch((error) => {
        onTodos(prev => prev.filter(t => t.id !== temporaryTodo.id));
        onErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        onTempTodo(null);
        onIsInputDisabled(false);
        onIsTodoLoading(null);
      });
  };

  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textField.current && !updateInputFocus) {
      textField.current.focus();
    }
  }, [
    updateInputFocus,
    isInputDisabled,
    deleteCompletedTodos,
    deleteTodos,
  ]);

  const pattern = /[\p{L}\p{N}\p{S}]+/gu;

  const reset = () => {
    onQuery('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    onErrorMessage('');

    event.preventDefault();

    if (!query || !pattern.test(query)) {
      onErrorMessage('Title should not be empty');

      return;
    }

    addTodos({
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    }).then(reset)
      .catch((error) => error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isInputDisabled}
        ref={textField}
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
    </form>
  );
};
