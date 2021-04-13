import { memo } from 'react';
import propTypes from 'prop-types';
import { isEqual } from '@/libs/isEqual';

/**
 * @param {ConnectHook} useHook
 * @param {string} [name='UseHook']
 * @return {ConnectedComponent}
 * */
export function connectUseHook(useHook, name = 'UseHook') {
  return (Component) => {
    const MemoizedComponent = memo(Component, isEqual);

    WithUseHook.propTypes = {
      children: propTypes.node,
    };

    WithUseHook.defaultProps = {
      children: null,
    };

    function WithUseHook(props) {
      const { children, ...restProps } = props;

      const hookData = useHook(restProps);

      return (
        <MemoizedComponent
          {...restProps}
          {...hookData}
        >
          {children}
        </MemoizedComponent>
      );
    }

    WithUseHook.displayName = `With${name}`;

    return memo(WithUseHook, isEqual);
  };
}

/**
 * @typedef {function(any): Object} ConnectHook
 * */

/**
 * @typedef {Function} ConnectedComponent
 * @param {React.Component}
 * @return {React.NamedExoticComponent}
 * */
