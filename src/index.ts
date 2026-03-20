import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_git_syntax_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_git_syntax_extension:plugin',
  description: 'Jupyterlab extension to add syntax highlighting to various git files such as gitmodules, gitignore etc',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_git_syntax_extension is activated!');
  }
};

export default plugin;
