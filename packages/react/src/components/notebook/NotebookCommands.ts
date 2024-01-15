/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { CommandRegistry } from '@lumino/commands';
import { SessionContextDialogs } from '@jupyterlab/apputils';
import { CompletionHandler } from '@jupyterlab/completer';
import {
  NotebookActions,
  NotebookPanel,
  NotebookSearchProvider,
  NotebookTracker,
} from '@jupyterlab/notebook';
import {
  SearchDocumentModel,
  SearchDocumentView,
} from '@jupyterlab/documentsearch';
import { Widget } from '@lumino/widgets';
import { nullTranslator } from '@jupyterlab/translation';

/**
 * The map of command ids used by the notebook.
 */
export const cmdIds = {
  changeCellType: 'notebook-cell:change-cell-type',
  changeCellTypeToCode: 'notebook-cell:change-cell-to-code',
  changeCellTypeToMarkdown: 'notebook-cell:change-cell-to-markdown',
  changeCellTypeToRaw: 'notebook-cell:change-cell-to-raw',
  commandMode: 'notebook:command-mode',
  deleteCells: 'notebook-cells:delete',
  editMode: 'notebook:edit-mode',
  extendAbove: 'notebook-cells:extend-above',
  extendBelow: 'notebook-cells:extend-below',
  extendBottom: 'notebook-cells:extend-bottom',
  extendTop: 'notebook-cells:extend-top',
  findNext: 'documentsearch:find-next',
  findPrevious: 'documentsearch:find-previous',
  insertAbove: 'notebook-cells:insert-above',
  insertBelow: 'notebook-cells:insert-below',
  interrupt: 'notebook:interrupt-kernel',
  invoke: 'completer:invoke',
  invokeNotebook: 'completer:invoke-notebook',
  merge: 'notebook-cells:merge',
  redo: 'notebook-cells:redo',
  restart: 'notebook:restart-kernel',
  run: 'notebook:run-cell',
  runAll: 'notebook:run-all',
  runAndAdvance: 'notebook-cells:run-and-advance',
  save: 'notebook:save',
  select: 'completer:select',
  selectAbove: 'notebook-cells:select-above',
  selectBelow: 'notebook-cells:select-below',
  selectNotebook: 'completer:select-notebook',
  split: 'notebook-cells:split',
  startSearch: 'documentsearch:start-search',
  switchKernel: 'notebook:switch-kernel',
  undo: 'notebook-cells:undo',
};

export const NotebookCommands = (
  commandRegistry: CommandRegistry,
  notebookPanel: NotebookPanel,
  completerHandler: CompletionHandler,
  tracker: NotebookTracker,
  path?: string,
): void => {
  // Add commands.
  commandRegistry.addCommand(cmdIds.invoke, {
    label: 'Completer: Invoke',
    execute: () => completerHandler.invoke(),
  });
  commandRegistry.addCommand(cmdIds.select, {
    label: 'Completer: Select',
    execute: () => completerHandler.completer.selectActive(),
  });
  commandRegistry.addCommand(cmdIds.invokeNotebook, {
    label: 'Invoke Notebook',
    execute: () => {
      if (notebookPanel.content.activeCell?.model.type === 'code') {
        return commandRegistry.execute(cmdIds.invoke);
      }
    },
  });
  commandRegistry.addCommand(cmdIds.selectNotebook, {
    label: 'Select Notebook',
    execute: () => {
      if (notebookPanel.content.activeCell?.model.type === 'code') {
        return commandRegistry.execute(cmdIds.select);
      }
    },
  });
  if (path) {
    commandRegistry.addCommand(cmdIds.save, {
      label: 'Save',
      execute: () => notebookPanel.context.save(),
    });
  }
  let searchInstance: SearchDocumentView | undefined;
  commandRegistry.addCommand(cmdIds.startSearch, {
    label: 'Find…',
    execute: () => {
      if (!searchInstance) {
        const provider = new NotebookSearchProvider(
          notebookPanel,
          nullTranslator,
        );
        const searchModel = new SearchDocumentModel(provider, 500);
        searchInstance = new SearchDocumentView(searchModel);
        /**
         * Activate the target widget when the search panel is closing
         */
        searchInstance.closed.connect(() => {
          if (!notebookPanel.isDisposed) {
            notebookPanel.activate();
          }
        });
        searchInstance.disposed.connect(() => {
          if (!notebookPanel.isDisposed) {
            notebookPanel.activate();
          }
          // find next and previous are now disabled
          commandRegistry.notifyCommandChanged();
        });
        /**
         * Dispose resources when the widget is disposed.
         */
        notebookPanel.disposed.connect(() => {
          searchInstance?.dispose();
          searchModel.dispose();
          provider.dispose();
        });
      }
      if (!searchInstance.isAttached) {
        Widget.attach(searchInstance, notebookPanel.node);
        searchInstance.node.style.top = `${
          notebookPanel.toolbar.node.getBoundingClientRect().height +
          notebookPanel.contentHeader.node.getBoundingClientRect().height
        }px`;
        if (searchInstance.model.searchExpression) {
          searchInstance.model.refresh();
        }
      }
      searchInstance.focusSearchInput();
    },
  });
  commandRegistry.addCommand(cmdIds.findNext, {
    label: 'Find Next',
    isEnabled: () => !!searchInstance,
    execute: async () => {
      if (!searchInstance) {
        return;
      }
      await searchInstance.model.highlightNext();
    },
  });
  commandRegistry.addCommand(cmdIds.findPrevious, {
    label: 'Find Previous',
    isEnabled: () => !!searchInstance,
    execute: async () => {
      if (!searchInstance) {
        return;
      }
      await searchInstance.model.highlightPrevious();
    },
  });
  commandRegistry.addCommand(cmdIds.interrupt, {
    label: 'Interrupt',
    execute: async () =>
      notebookPanel.context.sessionContext.session?.kernel?.interrupt(),
  });
  const sessionContextDialogs = new SessionContextDialogs();
  commandRegistry.addCommand(cmdIds.restart, {
    label: 'Restart Kernel',
    execute: () =>
      sessionContextDialogs.restart(notebookPanel.context.sessionContext),
  });
  commandRegistry.addCommand(cmdIds.switchKernel, {
    label: 'Switch Kernel',
    execute: () =>
      sessionContextDialogs.selectKernel(notebookPanel.context.sessionContext),
  });
  commandRegistry.addCommand(cmdIds.runAndAdvance, {
    label: 'Run and Advance',
    execute: () => {
      return NotebookActions.runAndAdvance(
        notebookPanel.content,
        notebookPanel.context.sessionContext,
      );
    },
  });
  commandRegistry.addCommand(cmdIds.run, {
    label: 'Run',
    execute: () => {
      return NotebookActions.run(
        notebookPanel.content,
        notebookPanel.context.sessionContext,
      );
    },
  });
  commandRegistry.addCommand(cmdIds.runAll, {
    label: 'Run all',
    execute: () => {
      return NotebookActions.runAll(
        notebookPanel.content,
        notebookPanel.context.sessionContext,
      );
    },
  });
  commandRegistry.addCommand(cmdIds.deleteCells, {
    label: 'Delete Cells',
    execute: () => {
      return NotebookActions.deleteCells(notebookPanel.content);
    },
  });
  commandRegistry.addCommand(cmdIds.insertAbove, {
    label: 'Insert Above',
    execute: () => {
      return NotebookActions.insertAbove(notebookPanel.content);
    },
  });
  commandRegistry.addCommand(cmdIds.insertBelow, {
    label: 'Insert Below',
    execute: () => {
      return NotebookActions.insertBelow(notebookPanel.content);
    },
  });
  commandRegistry.addCommand(cmdIds.editMode, {
    label: 'Edit Mode',
    execute: () => {
      notebookPanel.content.mode = 'edit';
    },
  });
  commandRegistry.addCommand(cmdIds.commandMode, {
    label: 'Command Mode',
    execute: () => {
      notebookPanel.content.mode = 'command';
    },
  });
  commandRegistry.addCommand(cmdIds.selectBelow, {
    label: 'Select Below',
    execute: () => NotebookActions.selectBelow(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.selectAbove, {
    label: 'Select Above',
    execute: () => NotebookActions.selectAbove(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.extendAbove, {
    label: 'Extend Above',
    execute: () => NotebookActions.extendSelectionAbove(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.extendTop, {
    label: 'Extend to Top',
    execute: () =>
      NotebookActions.extendSelectionAbove(notebookPanel.content, true),
  });
  commandRegistry.addCommand(cmdIds.extendBelow, {
    label: 'Extend Below',
    execute: () => NotebookActions.extendSelectionBelow(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.extendBottom, {
    label: 'Extend to Bottom',
    execute: () =>
      NotebookActions.extendSelectionBelow(notebookPanel.content, true),
  });
  commandRegistry.addCommand(cmdIds.merge, {
    label: 'Merge Cells',
    execute: () => NotebookActions.mergeCells(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.split, {
    label: 'Split Cell',
    execute: () => NotebookActions.splitCell(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.undo, {
    label: 'Undo',
    execute: () => NotebookActions.undo(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.redo, {
    label: 'Redo',
    execute: () => NotebookActions.redo(notebookPanel.content),
  });
  commandRegistry.addCommand(cmdIds.changeCellTypeToCode, {
    label: 'Change Cell Type to Code',
    execute: args =>
      NotebookActions.changeCellType(notebookPanel.content, 'code'),
  });
  commandRegistry.addCommand(cmdIds.changeCellTypeToMarkdown, {
    label: 'Change Cell Type to Markdown',
    execute: args =>
      NotebookActions.changeCellType(notebookPanel.content, 'markdown'),
  });
  commandRegistry.addCommand(cmdIds.changeCellTypeToRaw, {
    label: 'Change Cell Type to Raw',
    execute: args =>
      NotebookActions.changeCellType(notebookPanel.content, 'raw'),
  });

  function getCurrent(args: ReadonlyPartialJSONObject): NotebookPanel | null {
    return tracker.currentWidget;
  }
  function isEnabled(): boolean {
    return tracker.currentWidget !== null;
  }
  commandRegistry.addCommand('run-selected-codecell', {
    label: 'Run Cell',
    execute: args => {
      const current = getCurrent(args);
      if (current) {
        const { context, content } = current;
        NotebookActions.run(content, context.sessionContext);
      }
    },
    isEnabled,
  });

  const bindings = [
    {
      selector: '.jp-Notebook.jp-mod-editMode .jp-mod-completer-enabled',
      keys: ['Tab'],
      command: cmdIds.invokeNotebook,
    },
    {
      selector: '.jp-mod-completer-active',
      keys: ['Enter'],
      command: cmdIds.selectNotebook,
    },
    {
      selector: '.jp-Notebook',
      keys: ['Ctrl Enter'],
      command: cmdIds.run,
    },
    {
      selector: '.jp-Notebook',
      keys: ['Shift Enter'],
      command: cmdIds.runAndAdvance,
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel F'],
      command: cmdIds.startSearch,
    },
    {
      selector: '.jp-Notebook:focus',
      keys: ['D', 'D'],
      command: cmdIds.deleteCells,
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel G'],
      command: cmdIds.findNext,
    },
    {
      selector: '.jp-Notebook',
      keys: ['Accel Shift G'],
      command: cmdIds.findPrevious,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['I', 'I'],
      command: cmdIds.interrupt,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['0', '0'],
      command: cmdIds.restart,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Enter'],
      command: cmdIds.editMode,
    },
    {
      selector: '.jp-Notebook.jp-mod-editMode',
      keys: ['Escape'],
      command: cmdIds.commandMode,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift M'],
      command: cmdIds.merge,
    },
    {
      selector: '.jp-Notebook.jp-mod-editMode',
      keys: ['Ctrl Shift -'],
      command: cmdIds.split,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['J'],
      command: cmdIds.selectBelow,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['ArrowDown'],
      command: cmdIds.selectBelow,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['A'],
      command: cmdIds.insertAbove,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['B'],
      command: cmdIds.insertBelow,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['K'],
      command: cmdIds.selectAbove,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['ArrowUp'],
      command: cmdIds.selectAbove,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift K'],
      command: cmdIds.extendAbove,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Shift J'],
      command: cmdIds.extendBelow,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Ctrl Z'],
      command: cmdIds.undo,
    },
    {
      selector: '.jp-Notebook.jp-mod-commandMode:focus',
      keys: ['Ctrl Y'],
      command: cmdIds.redo,
    },
    {
      selector: '.jp-Notebook:focus',
      keys: ['M'],
      command: cmdIds.changeCellTypeToMarkdown,
    },
    {
      selector: '.jp-Notebook:focus',
      keys: ['R'],
      command: cmdIds.changeCellTypeToRaw,
    },
    {
      selector: '.jp-Notebook:focus',
      keys: ['Y'],
      command: cmdIds.changeCellTypeToCode,
    },
  ];
  bindings.map(binding => commandRegistry.addKeyBinding(binding));

  if (path) {
    commandRegistry.addKeyBinding({
      selector: '.jp-Notebook',
      keys: ['Accel S'],
      command: cmdIds.save,
    });
  }
};

export default NotebookCommands;
