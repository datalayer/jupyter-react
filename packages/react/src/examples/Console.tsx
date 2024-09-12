/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createRoot } from 'react-dom/client';
import { Box } from '@primer/react';
import { JupyterReactTheme } from '../themes/JupyterReactTheme';
import Console from '../components/console/Console';

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(
  <JupyterReactTheme>
    <Box as="h1">A Jupyter Console</Box>
    <Console code={"print('👋 Hello Jupyter Console')"} />
  </JupyterReactTheme>
);
