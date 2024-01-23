/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { NotebookPanel } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
// import { IInputPrompt } from '@jupyterlab/cells';
// import { IOutputPrompt } from '@jupyterlab/outputarea';
// import CountdownInputPrompt from '../../../../components/notebook/cell/prompt/CountdownInputPrompt';
// import CountdownOutputPrompt from '../../../../components/notebook/cell/prompt/CountdownOutputPrompt';

export class CountdownPromptContentFactory extends NotebookPanel.ContentFactory {
  constructor(options: Cell.ContentFactory.IOptions) {
    super(options);
  }
  /** @override */
  /*
  createInputPrompt(): IInputPrompt {
    return new CountdownInputPrompt();
  }
*/
  /** @override */
  /*
  createOutputPrompt(): IOutputPrompt {
    return new CountdownOutputPrompt();
  }
*/
}

export default CountdownPromptContentFactory;
