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

    // Register file types in document registry
    app.docRegistry.addFileType({
      name: 'gitignore',
      displayName: 'Gitignore',
      mimeTypes: ['text/x-gitignore'],
      extensions: ['.gitignore'],
      pattern: '^\\.gitignore$',
      fileFormat: 'text' as const,
      contentType: 'file' as const
    });

    app.docRegistry.addFileType({
      name: 'gitconfig',
      displayName: 'Git Config',
      mimeTypes: ['text/x-gitconfig'],
      extensions: ['.gitconfig'],
      pattern: '^\\.gitconfig$',
      fileFormat: 'text' as const,
      contentType: 'file' as const
    });

    app.docRegistry.addFileType({
      name: 'gitmodules',
      displayName: 'Git Modules',
      mimeTypes: ['text/x-gitconfig'],
      extensions: ['.gitmodules'],
      pattern: '^\\.gitmodules$',
      fileFormat: 'text' as const,
      contentType: 'file' as const
    });

    app.docRegistry.addFileType({
      name: 'gitattributes',
      displayName: 'Git Attributes',
      mimeTypes: ['text/x-gitattributes'],
      extensions: ['.gitattributes'],
      pattern: '^\\.gitattributes$',
      fileFormat: 'text' as const,
      contentType: 'file' as const
    });
  }
};

export default plugin;
