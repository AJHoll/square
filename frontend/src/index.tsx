import React from 'react';
import ReactDOM from 'react-dom/client';
import 'ag-grid-community/styles/ag-grid.css';
import '@ajholl/devsuikit/dist/styles/devs-ui-kit.css';
import '@ajholl/devsuikit/dist/styles/devs-ui-kit-icons.css';
import './index.scss';
import DevsContent from '@ajholl/devsuikit/dist/DevsContent';
import Routes from './routes';
import RootStore from './views/Root.store';
import {ConfigFile} from "./dtos/ConfigFile";
setTimeout(() => {
    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement,
    );
    fetch('/config.json')
        .then(async (config) => {
            const jsonConfig: ConfigFile = (await config.json());
            const rootStore: RootStore = new RootStore(jsonConfig);
            root.render(
                <DevsContent>
                    <Routes rootStore={rootStore}/>
                </DevsContent>
            );
        });
}, 1000);
