import React from 'react';
import Markdown from 'react-markdown';

const readmeContents = `# Klara-UI

A repository for shared components and styles used in Klara.

## Get Started

\`\`\`
npm install klara-ui
npm install klara-ui@next
\`\`\`

## Usage

### Components

Klara UI comes with a set of components. They adhere to the overall design, and allow for some configuration.

- [Autocomplete]
- [Badge]
- [Button]
- [Dateformat]
- [Dropdown]
- [Icon]
- [Notification]
- [Spinner]
- [Switch]
- [TextField]
- [TextField - Custom]
- [TextHighlight]
- [Tooltip]

### Styles

All the styles should be in the form of .styl
If you add a new file don't forget to import it in the styles.styl

#### Using the styles

Including styles in your own project can be tricky if not done correctly.
Fortunately we can use stylus loader for resolving to .styl files in node_modules_

Include all the styles in your .styl with:

\`\`\`
@import "~klara-ui/style/styles.styl"
\`\`\`

You can also specify the precise path for a file, eg.

\`\`\`
@import "~klara-ui/style/variables/typography.styl"
\`\`\`

Read more at: https://www.npmjs.com/package/stylus-loader
`;

export default () => (
  <div>
    <Markdown source={readmeContents} />
  </div>
);
