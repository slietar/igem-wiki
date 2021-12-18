import './animation';
import './date';
import './plot';
import './header';
import './toc';

import './pages/communication';
import './pages/home';
import './pages/hp';
import './pages/implementation';


document.title = 'CuRe - EPFL iGEM 2021';

let link = document.querySelector("link[rel~='icon']");

if (link) {
  link.href = 'https://2021.igem.org/wiki/images/7/7a/T--EPFL--favicon.svg';
} else {
  link = document.createElement('link');
  link.href = 'assets/favicon.svg';
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  document.getElementsByTagName('head')[0].appendChild(link);
}
