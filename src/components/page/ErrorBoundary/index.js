import { Component } from 'react';
import propTypes from 'prop-types';
import { captureException } from '@/libs/exceptions';
import ErrorBoundaryFallback from './Fallback';

const ERROR_TYPES = {
  OFFLINE: 'OFFLINE',
  CHUNK_LOADING: 'CHUNK_LOADING',
  RUNTIME: 'RUNTIME',
};

/**
 * @param {Error} error
 * @return {'OFFLINE'|'CHUNK_LOADING'|'RUNTIME'}
 * */
function getErrorType(error) {
  if (!window.navigator.onLine) {
    return ERROR_TYPES.OFFLINE;
  }
  if (error.toString().includes('ChunkLoadError')) {
    return ERROR_TYPES.CHUNK_LOADING;
  }
  return ERROR_TYPES.RUNTIME;
}

class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return {
      errorType: getErrorType(error),
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      errorType: '',
    };
  }
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  componentDidCatch(error, errorInfo) {
    captureException(error);
  }
  render() {
    const { children } = this.props;
    const { errorType } = this.state;

    if (errorType) {
      return (
        <ErrorBoundaryFallback errorType={errorType} />
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: propTypes.node,
};

ErrorBoundary.defaultProps = {
  children: null,
};

export default ErrorBoundary;
