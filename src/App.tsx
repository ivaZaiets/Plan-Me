/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoList } from './components/TodoList/TodoList';
import { TodoError } from './components/TodoError/TodoError';
import { Header } from './components/Header/Header';
import { TodoFooter } from './components/TodoFooter/TodoFooter';

import { useCustomContext } from './helpers/context/customContext';

import './App.scss';

export const App = () => {
  const { todos } = useCustomContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Plan Me</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        {todos.length !== 0 && (
          <TodoFooter />
        )}
      </div>

      <TodoError />
    </div>
  );
};
