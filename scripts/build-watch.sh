npx sass src/styles/index.scss:dist/styles.css --watch\
  & npx pug src/pages --out dist --silent --watch\
  & npx cpx 'src/assets/**/*' dist/assets --watch\
  & npx parcel watch src/scripts/index.js --cache-dir tmp/parcel --out-file dist/scripts.js
