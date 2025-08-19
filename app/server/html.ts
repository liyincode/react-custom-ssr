interface RenderProps {
    appContent: string;
    linkTags?: string;
    scriptTags?: string;
    styleTags?: string;
}

export default ({ appContent, linkTags = '', styleTags = '', scriptTags = '' }: RenderProps) =>
    `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>My SSR App</title>
    ${styleTags}
    ${linkTags}
  </head>
  <body>
    <div id="root">${appContent}</div>
    ${scriptTags}
  </body>
  </html>`;
