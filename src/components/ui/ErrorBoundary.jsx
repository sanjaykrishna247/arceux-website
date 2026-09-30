import { Component } from 'react';

/** Keeps a failing 3D view (e.g. WebGL context errors) from blanking the whole page. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('3D view failed, showing fallback instead:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
