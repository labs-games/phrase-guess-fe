import { Component, ErrorInfo, ReactNode } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

type ResetErrorCallback = () => void;

export interface RenderFallbackProps {
  componentStack: string;
  error: Error | null;
  resetError: ResetErrorCallback;
}
type RenderFallbackCallback = (props: RenderFallbackProps) => ReactNode;
type OnErrorCallback = (error: Error, componentStack: string) => void;

interface ErrorBoundaryProps {
  onError?: OnErrorCallback;
  renderFallback: RenderFallbackCallback;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: ErrorInfo | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps & RouteComponentProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    info: null,
  };

  unlisten: () => void;

  componentDidMount() {
    const { history } = this.props;

    this.unlisten = history.listen(() => {
      const { error } = this.state;
      if (error !== null) {
        this.resetError();
      }
    });
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info.componentStack);
      } catch (ignoredError) {
        /* ignore */
      }
    }

    this.setState({ error, info });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  resetError = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    const { children, renderFallback } = this.props;
    const { error, info } = this.state;

    if (error !== null) {
      const { componentStack } = info || { componentStack: '' };
      return renderFallback({
        componentStack,
        error,
        resetError: this.resetError,
      });
    }

    return children;
  }
}

export default withRouter(ErrorBoundary);
