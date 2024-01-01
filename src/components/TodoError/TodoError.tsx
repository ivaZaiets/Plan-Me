import cn from 'classnames';

import { useCustomContext } from '../../helpers/context/customContext';

export const TodoError = () => {
  const { errorMessage, onErrorMessage } = useCustomContext();

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={
          cn('notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          })
        }
      >

        {/* eslint-disable jsx-a11y/control-has-associated-label */}

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onErrorMessage('')}
        />
        {errorMessage}
      </div>
    </>
  );
};
