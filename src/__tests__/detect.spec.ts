import { EditorLanguageRegistry } from '@jupyterlab/codemirror';
import plugin from '../index';

describe('automatic file detection', () => {
  const languages = new EditorLanguageRegistry();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin.activate(null as any, languages);

  it.each([
    ['.gitignore', 'gitignore'],
    ['repo/.gitconfig', 'gitconfig'],
    ['.gitmodules', 'gitconfig'],
    ['.git/config', 'gitconfig'],
    ['.gitattributes', 'gitattributes']
  ])('should open %s as %s', (file, name) => {
    expect(languages.findByFileName(file)?.name).toBe(name);
  });

  it('should leave another file name alone', () => {
    expect(languages.findByFileName('config.yaml')).toBeNull();
  });
});
