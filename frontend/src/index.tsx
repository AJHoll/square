import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ajholl/devsuikit/dist/styles/devs-ui-kit.css';
import '@ajholl/devsuikit/dist/styles/devs-ui-kit-icons.css';
import './index.scss';
import DevsContent from '@ajholl/devsuikit/dist/DevsContent';
import Routes from './routes';
import RootStore from './views/Root.store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const rootStore: RootStore = new RootStore();

root.render(
  <DevsContent>
    <Routes rootStore={rootStore} />
  </DevsContent>,
);
