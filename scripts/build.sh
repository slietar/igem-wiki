mkdir -p dist\
  && npx sass src/styles/index.scss:dist/styles.css --no-source-map\
  && npx pug src/pages --out tmp/pages1 --silent\
  && npx posthtml tmp/pages1/* --config posthtml.json --output dist > /dev/null\
  && npx cpx 'src/assets/**/*' dist/assets\
  && npx cpx 'node_modules/@fontsource/inter/files/inter-latin-variable-wghtOnly-normal.woff2' dist/assets/fonts\
  && npx cpx 'node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff2' dist/assets/fonts\
  && npx cpx 'node_modules/@fontsource/secular-one/files/secular-one-latin-400-normal.woff2' dist/assets/fonts\
  && npx parcel build src/scripts/index.js --cache-dir tmp/parcel --log-level 2 --no-source-maps --out-file dist/scripts.js
