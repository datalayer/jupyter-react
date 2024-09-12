/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createRoot } from 'react-dom/client';
import { Jupyter } from '../jupyter/Jupyter';
import { Notebook } from '../components/notebook/Notebook';
import { NotebookToolbar } from './../components/notebook/toolbar/NotebookToolbar';
import { CellSidebarButton } from '../components/notebook/cell/sidebar/CellSidebarButton';

const NOTEBOOK_ID = 'notebook-id';

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(
  <Jupyter
    jupyterServerUrl="https://oss.datalayer.run/api/jupyter-server"
    jupyterServerToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
  >
    <Notebook
      path="ipywidgets.ipynb"
      id={NOTEBOOK_ID}
      height="calc(100vh - 2.6rem)" // (Height - Toolbar Height).
      cellSidebarMargin={60}
      CellSidebar={CellSidebarButton}
      Toolbar={NotebookToolbar}
    />
  </Jupyter>
);
