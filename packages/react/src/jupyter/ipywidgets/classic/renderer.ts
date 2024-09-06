/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { HTMLManager } from '@jupyter-widgets/html-manager/lib/htmlmanager';

// Renderer to allow the output widget to render sub-widgets
export class WidgetRenderer extends Widget implements IRenderMime.IRenderer {
  constructor(options: IRenderMime.IRendererOptions, manager: HTMLManager) {
    super();
    this.mimeType = options.mimeType;
    this._manager = manager;
  }

  async renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const source: any = model.data[this.mimeType];
    if (!this._manager.has_model(source.model_id)) {
      this.node.textContent = 'Error creating widget: could not find model';
      this.addClass('jupyter-widgets');
      return;
    }
    try {
      const wModel = await this._manager.get_model(source.model_id);
      const wView = await this._manager.create_view(wModel);
      Widget.attach(wView.luminoWidget, this.node);
    } catch (err) {
      console.log('Error displaying Lumino Widget');
      console.log(err);
      this.node.textContent = 'Error displaying Lumino Widget';
      this.addClass('jupyter-widgets');
    }
  }

  /**
   * The mimetype being rendered.
   */
  readonly mimeType: string;
  private _manager: HTMLManager;
}
