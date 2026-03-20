import { StreamParser } from '@codemirror/language';

interface IGitattributesState {
  patternConsumed: boolean;
}

export const gitattributesMode: StreamParser<IGitattributesState> = {
  name: 'gitattributes',

  startState: (): IGitattributesState => ({
    patternConsumed: false
  }),

  token: (stream, state): string | null => {
    // Reset at start of line
    if (stream.sol()) {
      state.patternConsumed = false;
    }

    // Skip whitespace (but not at sol when pattern not consumed)
    if (state.patternConsumed && stream.eatSpace()) {
      return null;
    }

    // Comments
    if (stream.sol() && stream.peek() === '#') {
      stream.skipToEnd();
      return 'comment';
    }

    // Blank line
    if (stream.sol() && stream.eol()) {
      return null;
    }

    // Pattern (first token on line)
    if (!state.patternConsumed) {
      // Macro definition: [attr]name
      if (stream.sol() && stream.match(/\[attr\]/)) {
        return 'keyword';
      }
      // Consume the pattern (non-whitespace)
      stream.match(/\S+/);
      state.patternConsumed = true;
      return 'string';
    }

    // Attributes after pattern
    // Unset: -attr
    if (stream.eat(/-/)) {
      stream.match(/[a-zA-Z0-9_][-a-zA-Z0-9_.]*/);
      return 'keyword';
    }

    // Unspecify: !attr
    if (stream.eat(/!/)) {
      stream.match(/[a-zA-Z0-9_][-a-zA-Z0-9_.]*/);
      return 'keyword';
    }

    // attr=value or attr (set)
    if (stream.match(/[a-zA-Z0-9_][-a-zA-Z0-9_.]*/)) {
      // Check for =value
      if (stream.eat(/=/)) {
        stream.match(/\S*/);
        return 'string';
      }
      return 'keyword';
    }

    stream.next();
    return null;
  }
};
