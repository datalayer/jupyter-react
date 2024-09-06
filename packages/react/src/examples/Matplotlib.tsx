/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createRoot } from 'react-dom/client';
import { INotebookContent } from '@jupyterlab/nbformat';
import Jupyter from '../jupyter/Jupyter';
import JupyterLabCss from '../jupyter/lab/JupyterLabCss';
import Notebook from '../components/notebook/Notebook';
import NotebookToolbar from './toolbars/NotebookToolbar';
import CellSidebar from '../components/notebook/cell/sidebar/CellSidebar';

import notebook from './notebooks/Matplotlib.ipynb.json';

const Matplotlib = () => (
  <Jupyter disableCssLoading>
    <JupyterLabCss colorMode="light" />
    <Notebook
      nbformat={notebook as INotebookContent}
      id="notebook-matplotlib-id"
      height="calc(100vh - 2.6rem)" // (Height - Toolbar Height).
      cellSidebarMargin={120}
      CellSidebar={CellSidebar}
      Toolbar={NotebookToolbar}
    />
  </Jupyter>
);

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(<Matplotlib />);
