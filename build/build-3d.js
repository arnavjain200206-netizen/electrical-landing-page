#!/usr/bin/env node
/* Bundles the 3D product models (models3d/) into assets/models3d.js.
   Only needed when you change the models:   npm install   then   npm run build:3d
   The finished file is committed, so hosting and the normal site build need none of this. */
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
esbuild.build({
  entryPoints: [path.join(ROOT, 'models3d/index.js')],
  outfile: path.join(ROOT, 'assets/models3d.js'),
  bundle: true, minify: true, format: 'iife', target: ['es2019'], legalComments: 'none',
  banner: { js: '/* 3D product models. Built from models3d/ with three.js (MIT licence, https://threejs.org). Do not edit: run npm run build:3d. */' }
}).then((r) => {
  const size = require('fs').statSync(path.join(ROOT, 'assets/models3d.js')).size;
  console.log('assets/models3d.js ' + (size / 1024).toFixed(0) + ' KB (minified)');
}).catch(() => process.exit(1));
