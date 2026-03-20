import { StreamParser } from '@codemirror/language';

const BOOLEAN_VALUES = new Set([
  'true',
  'false',
  'yes',
  'no',
  'on',
  'off'
]);

interface IGitconfigState {
  inSectionHeader: boolean;
  inValue: boolean;
  continuationLine: boolean;
}

export const gitconfigMode: StreamParser<IGitconfigState> = {
  name: 'gitconfig',

  startState: (): IGitconfigState => ({
    inSectionHeader: false,
    inValue: false,
    continuationLine: false
  }),

  token: (stream, state): string | null => {
    // Handle continuation lines
    if (stream.sol()) {
      if (!state.continuationLine) {
        state.inValue = false;
      }
      state.continuationLine = false;
    }

    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    // Inside section header [section "subsection"]
    if (state.inSectionHeader) {
      if (stream.eat(/]/)) {
        state.inSectionHeader = false;
        return 'bracket';
      }
      // Quoted subsection
      if (stream.peek() === '"') {
        stream.next();
        while (!stream.eol()) {
          if (stream.eat(/\\/)) {
            stream.next();
          } else if (stream.peek() === '"') {
            stream.next();
            return 'string';
          } else {
            stream.next();
          }
        }
        return 'string';
      }
      // Section name
      stream.match(/[a-zA-Z0-9._-]+/);
      return 'keyword';
    }

    // Comments: # or ;
    if (stream.sol() && stream.eat(/[#;]/)) {
      stream.skipToEnd();
      return 'comment';
    }
    if (!state.inValue && stream.eat(/[#;]/)) {
      stream.skipToEnd();
      return 'comment';
    }

    // Section header start
    if (stream.sol() && stream.eat(/\[/)) {
      state.inSectionHeader = true;
      return 'bracket';
    }

    // Key name (not in value context, not in section header)
    if (!state.inValue && !state.inSectionHeader) {
      if (stream.match(/[a-zA-Z][a-zA-Z0-9-]*/)) {
        return 'property';
      }
    }

    // Equals operator
    if (!state.inValue && stream.eat(/=/)) {
      state.inValue = true;
      return 'operator';
    }

    // Value parsing
    if (state.inValue) {
      // Trailing backslash continuation
      if (stream.eol()) {
        return null;
      }

      // Quoted string value
      if (stream.peek() === '"') {
        stream.next();
        while (!stream.eol()) {
          if (stream.eat(/\\/)) {
            stream.next();
          } else if (stream.peek() === '"') {
            stream.next();
            return 'string';
          } else {
            stream.next();
          }
        }
        return 'string';
      }

      // Inline comment in value context
      if (stream.match(/\s+[#;]/, false)) {
        stream.eatSpace();
        if (stream.eat(/[#;]/)) {
          stream.skipToEnd();
          return 'comment';
        }
      }

      // Boolean values
      if (stream.match(/\b(true|false|yes|no|on|off)\b/i)) {
        const word = stream.current().trim().toLowerCase();
        if (BOOLEAN_VALUES.has(word)) {
          return 'atom';
        }
      }

      // Integer values with optional suffix
      if (stream.match(/\d+[kKmMgG]?\b/)) {
        return 'number';
      }

      // Trailing backslash for continuation
      if (stream.match(/\\$/)) {
        state.continuationLine = true;
        return 'string';
      }

      // Unquoted value text
      stream.next();
      return 'string';
    }

    // Consume any other character
    stream.next();
    return null;
  }
};
