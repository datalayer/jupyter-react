/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { createElement } from 'react';
import { createPortal } from 'react-dom';
import { ICellHeader } from '@jupyterlab/cells';
import { CommandRegistry } from '@lumino/commands';
import { newUuid } from '../../../../utils/Utils';
import { ReactPortalWidget } from '../../../lumino/ReactPortalWidget';
import { notebookStore } from '../../NotebookZustand';

export const DATALAYER_CELL_HEADER_CLASS = 'dla-CellHeader-Container';

export type CellSidebarProps = {
  notebookId: string;
  cellId: string;
  command: CommandRegistry;
  nbgrader: boolean;
};

export class CellSidebarWidget
  extends ReactPortalWidget
  implements ICellHeader
{
  private readonly commands: CommandRegistry;
  constructor(
    CellSidebar: (props: CellSidebarProps) => JSX.Element,
    notebookId: string,
    nbgrader: boolean,
    commands: CommandRegistry,
  ) {
    super();
    this.commands = commands;
    this.addClass('jp-CellHeader');
    this.id = newUuid();
    const props: CellSidebarProps = {
      notebookId: notebookId,
      cellId: this.id,
      command: this.commands,
      nbgrader,
    };
    const sidebar = createElement(CellSidebar, props);
    const portalDiv = (
      <div className={DATALAYER_CELL_HEADER_CLASS}>{sidebar}</div>
    );
    const portal = createPortal(portalDiv, this.node);
    notebookStore.getState().addPortals({
      uid: notebookId,
      portals: [portal],
    });
  }
}

export default CellSidebarWidget;
