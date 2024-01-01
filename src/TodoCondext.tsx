import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './helpers/userId';

import * as dataOperations from './api/todos';

import { Todo } from './types/Todo';
import { TodoContextInterface } from './helpers/context/contextInterface';

export const Context = React.createContext<TodoContextInterface>(
  {} as TodoContextInterface,
);

export const TodoContext = ({ children }: { children: React.ReactNode }) => {
  const [todos, onTodos] = useState<Todo[]>([]);
  const [tempTodo, onTempTodo] = useState<Todo | null>(null);

  const [query, onQuery] = useState('');
  const [errorMessage, onErrorMessage] = useState('');
  const [isTodoSelected, onIsTodoSelected] = useState('');

  const [isTodoLoading, onIsTodoLoading] = useState<Todo | null>(null);
  const [isAllTodosLoading, onIsAllTodosLoading] = useState(false);

  const [isInputDisabled, onIsInputDisabled] = useState(false);

  const [updatingForm, onUpdatingForm] = useState<Todo | null>(null);

  const [updateInputFocus, onUpdateInputFocus] = useState(false);

  useEffect(() => {
    onErrorMessage('');
    dataOperations.getTodos(USER_ID)
      .then(onTodos)
      .catch((error) => {
        onErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  const errorTimerId = useRef(0);

  const showErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      onErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodos = (todoId: number) => {
    onErrorMessage('');

    todos.map(todo => (
      todo.id === todoId ? onIsTodoLoading(todo) : null
    ));

    return dataOperations.deleteTodos(todoId)
      .then(() => {
        onTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        onTodos(todos);
        onErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        onIsTodoLoading(null);
        onIsAllTodosLoading(false);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed === true);

  const deleteCompletedTodos = () => {
    todos.every(todo => (
      todo.completed ? onIsAllTodosLoading(true) : onIsTodoLoading(todo)
    ));

    return Promise.allSettled(completedTodos.map(todo => (
      deleteTodos(todo.id)
    )));
  };

  const updateTodos = (updatingTodo: Todo) => {
    onErrorMessage('');

    onIsTodoLoading(updatingTodo);

    return dataOperations.updateTodos(updatingTodo)
      .then(todo => {
        onTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(td => td.id === updatingTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch((error) => {
        onErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        onIsTodoLoading(null);
        onIsAllTodosLoading(false);
      });
  };

  const toggleAll = () => {
    onIsAllTodosLoading(true);

    const allCheckedTodos = todos.every(todo => todo.completed);
    const todosForUpdate = todos.filter(todo => (
      allCheckedTodos ? todo.completed : !todo.completed
    ));

    return Promise.allSettled(todosForUpdate.map(todo => (
      updateTodos({
        ...todo,
        completed: !todo.completed,
      })
    )));
  };

  const onCheckedToggle = (updatingTodo: Todo) => {
    onErrorMessage('');

    todos.map(todo => (
      todo.id === updatingTodo.id ? onIsTodoLoading(todo) : null
    ));

    const updatedTodo = { ...updatingTodo, completed: !updatingTodo.completed };

    return dataOperations.updateTodos(updatedTodo)
      .then(todo => {
        onTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(td => td.id === updatedTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch((error) => {
        onErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => onIsTodoLoading(null));
  };

  let copyOfTodos = [...todos];

  switch (isTodoSelected) {
    case 'all':
      copyOfTodos = todos.filter(todo => todo);
      break;
    case 'active':
      copyOfTodos = todos.filter(todo => !todo.completed);
      break;
    case 'completed':
      copyOfTodos = todos.filter(todo => todo.completed);
      break;
    default: copyOfTodos = todos;
  }

  const contextValue: TodoContextInterface = {
    todos,
    onTodos,
    tempTodo,
    onTempTodo,
    query,
    onQuery,
    errorMessage,
    onErrorMessage,
    isTodoSelected,
    onIsTodoSelected,
    isTodoLoading,
    onIsTodoLoading,
    isAllTodosLoading,
    onIsAllTodosLoading,
    isInputDisabled,
    onIsInputDisabled,
    updatingForm,
    onUpdatingForm,
    updateInputFocus,
    onUpdateInputFocus,
    deleteTodos,
    completedTodos,
    deleteCompletedTodos,
    updateTodos,
    toggleAll,
    onCheckedToggle,
    copyOfTodos,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};
