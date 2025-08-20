interface RenderProps {
    appContent: string;
    linkTags?: string;
    scriptTags?: string;
    styleTags?: string;
    dehydratedState?: any;
}

export default ({ appContent, linkTags = '', styleTags = '', scriptTags = '', dehydratedState }: RenderProps) =>
    `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My SSR App</title>
    ${styleTags}
    ${linkTags}
  </head>
  <body>
    <div id="root">${appContent}</div>
    <script id="__REACT_QUERY_STATE__" type="application/json">${JSON.stringify(dehydratedState)}</script>
    ${scriptTags}
  </body>
  </html>`;
