// build.js - simple build script to minify CSS/JS and copy site into /dist for deployment
const fs = require('fs-extra');
const path = require('path');
const csso = require('csso');
const terser = require('terser');

const root = path.resolve(__dirname);
const dist = path.join(root, 'dist');

async function run(){
  await fs.remove(dist);
  await fs.mkdirp(dist);

  // Minify CSS
  const css = await fs.readFile(path.join(root,'style.css'),'utf8');
  const cssMin = csso.minify(css).css;
  await fs.writeFile(path.join(dist,'style.min.css'), cssMin);

  // Minify JS
  const js = await fs.readFile(path.join(root,'script.js'),'utf8');
  const jsMinRes = await terser.minify(js, {compress:true, mangle:true});
  await fs.writeFile(path.join(dist,'script.min.js'), jsMinRes.code || '');

  // Copy HTML pages
  const pages = ['index.html','services.html','pricing.html','portfolio.html','about.html','contact.html','README.md','robots.txt','sitemap.xml'];
  for(const p of pages){
    const src = path.join(root, p);
    if(await fs.pathExists(src)){
      let content = await fs.readFile(src,'utf8');
      // Update references to minified assets in the copied pages
      content = content.replace(/href="style\.css"/g, 'href="style.min.css"');
      content = content.replace(/src="script\.js"/g, 'src="script.min.js"');
      await fs.writeFile(path.join(dist, p), content);
    }
  }

  // Copy assets and server folder
  if(await fs.pathExists(path.join(root,'assets'))){
    await fs.copy(path.join(root,'assets'), path.join(dist,'assets'));
  }

  // Copy minified files to root too for local preview
  await fs.copy(path.join(dist,'style.min.css'), path.join(root,'style.min.css'));
  await fs.copy(path.join(dist,'script.min.js'), path.join(root,'script.min.js'));

  console.log('Build completed. Files in /dist');
}

run().catch(err => { console.error(err); process.exit(1); });