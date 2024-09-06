/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createRoot } from 'react-dom/client';
import { Box } from '@primer/react';
import Jupyter from '../jupyter/Jupyter';
import Viewer from '../components/viewer/Viewer';

import nbformat from './notebooks/Matplotlib.ipynb.json';

const ViewerFile = () => {
  return (
    <>
      <Box m={3}>
        <Jupyter>
          <Viewer nbformat={nbformat} outputs />
        </Jupyter>
      </Box>
    </>
  );
};

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(<ViewerFile />);
