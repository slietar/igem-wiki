mkdir -p dist\
  && npx sass src/styles/index.scss:dist/styles.css --watch\
  & npx pug src/pages --out dist --silent --watch\
  & npx cpx 'src/assets/**/*' dist/assets --watch\
  & npx cpx 'node_modules/@fontsource/inter/files/inter-latin-variable-wghtOnly-normal.woff2' dist/assets/fonts --watch\
  & npx cpx 'node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff2' dist/assets/fonts --watch\
  & npx cpx 'node_modules/@fontsource/secular-one/files/secular-one-latin-400-normal.woff2' dist/assets/fonts --watch\
  & npx parcel watch src/scripts/index.js --cache-dir tmp/parcel --out-file dist/scripts.js
