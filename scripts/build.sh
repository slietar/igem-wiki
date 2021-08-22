mkdir -p dist\
  && npx sass src/styles/index.scss:dist/styles.css --no-source-map\
  && npx pug src/pages --out dist --silent\
  && npx cpx 'src/assets/**/*' dist/assets\
  && npx cpx 'node_modules/@fontsource/inter/files/inter-latin-variable-wghtOnly-normal.woff2' dist/assets/fonts\
  && npx cpx 'node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff2' dist/assets/fonts\
  && npx cpx 'node_modules/@fontsource/secular-one/files/secular-one-latin-400-normal.woff2' dist/assets/fonts
