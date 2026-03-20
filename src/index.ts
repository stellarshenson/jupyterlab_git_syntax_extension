import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IEditorLanguageRegistry } from '@jupyterlab/codemirror';
import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { gitignoreMode } from './gitignore-mode';
import { gitconfigMode } from './gitconfig-mode';
import { gitattributesMode } from './gitattributes-mode';

/**
 * Initialization data for the jupyterlab_git_syntax_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_git_syntax_extension:plugin',
  description:
    'Jupyterlab extension to add syntax highlighting to various git files such as gitmodules, gitignore etc',
  autoStart: true,
  requires: [IEditorLanguageRegistry],
  activate: (app: JupyterFrontEnd, languages: IEditorLanguageRegistry) => {
    console.log(
      '[jupyterlab_git_syntax_extension] Extension activated!'
    );

    // Register gitignore language
    languages.addLanguage({
      name: 'gitignore',
      displayName: 'Gitignore',
      mime: 'text/x-gitignore',
      extensions: ['.gitignore'],
      filename: /^\.gitignore$/,
      support: new LanguageSupport(StreamLanguage.define(gitignoreMode))
    });

    // Register gitconfig language (covers .gitconfig, .gitmodules, config)
    languages.addLanguage({
      name: 'gitconfig',
      displayName: 'Git Config',
      mime: 'text/x-gitconfig',
      extensions: ['.gitconfig', '.gitmodules'],
      filename: /^(\.gitconfig|\.gitmodules|config)$/,
      support: new LanguageSupport(StreamLanguage.define(gitconfigMode))
    });

    // Register gitattributes language
    languages.addLanguage({
      name: 'gitattributes',
      displayName: 'Git Attributes',
      mime: 'text/x-gitattributes',
      extensions: ['.gitattributes'],
      filename: /^\.gitattributes$/,
      support: new LanguageSupport(StreamLanguage.define(gitattributesMode))
    });

    // NOTE: Do not register file types via app.docRegistry.addFileType().
    // File type registration sets icons, and would override icons provided
    // by jupyterlab_vscode_icons_extension. Language registration above is
    // sufficient for syntax highlighting - it binds MIME types, extensions,
    // and filename patterns to the CodeMirror parsers.
  }
};

export default plugin;
