const globby = require('globby');
const TurndownService = require('turndown');
const path = require('path');
const {JSDOM} = require('jsdom');
const fs = require('fs-extra');
const turndownService = new TurndownService();


(async() => {
    const paths = await globby(['**/*.html', '!node_modules', '!rentalcodes', '!jekyll']);
    await Promise.all(paths.map(async(htmlPath) => {
        const html = await fs.readFile(htmlPath, 'utf8');
        const dom = new JSDOM(html);

        if (dom.window.document.querySelector('#breadcrumb')) {
            dom.window.document.querySelector('#breadcrumb').remove();
        }
        if (!dom.window.document.querySelector("#content")) {
          console.log(`Skipping HTML path ${htmlPath}`);
          return;
        }
        const content = dom.window.document.querySelector("#content").innerHTML;

        if (!content) {
            console.log(`Skipping ${htmlPath}`);
            return;
        }

        const directory = path.join('jekyll', path.dirname(htmlPath));
        const filename = path.basename(htmlPath).replace(/\.html$/, '.md');
        await fs.mkdirp(directory);
        await fs.writeFile(
            path.join(directory, filename),
`---
---
${turndownService.turndown(content)}
`
        );
    }));
})();
