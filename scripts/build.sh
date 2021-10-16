mkdir -p dist\
  && npx sass src/styles/index.scss:dist/styles.css --no-source-map --style compressed\
  && npx pug src/pages --out tmp/pages1 --silent\
  && npx posthtml tmp/pages1/* --config posthtml.json --output dist --use posthtml-toc/index.js --use posthtml-bibliography/index.js --use posthtml-format/index.js > /dev/null\
  && find dist/*.html -type f -exec npx js-beautify --file {} --replace --type html --quiet \; > /dev/null\
  && npx cpx 'src/assets/**/*' dist/assets\
  && npx cpx 'node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff' dist/assets/fonts\
  && npx parcel build src/scripts/index.js --cache-dir tmp/parcel --log-level 2 --no-source-maps --out-file dist/scripts.js
