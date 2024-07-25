/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createRoot } from 'react-dom/client';
import Notebook from '../components/notebook/Notebook';
import NotebookToolbar from './toolbars/NotebookToolbar';
import CellSidebar from '../components/notebook/cell/sidebar/CellSidebarButton';
import JupyterLabCss from '../jupyter/lab/JupyterLabCss';

const NOTEBOOK_ID = 'notebook-id';

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(
  <>
    <JupyterLabCss colorMode='dark' />
    <Notebook
      path="ipywidgets.ipynb"
      id={NOTEBOOK_ID}
      height="calc(100vh - 2.6rem)" // (Height - Toolbar Height).
      cellSidebarMargin={60}
      CellSidebar={CellSidebar}
      Toolbar={NotebookToolbar}
    />
  </>
);
