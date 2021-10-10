import './animation';
import './date';
import './header';
import './toc';


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


/* import Figure from '../../../dna/src/index.js';


let plot = document.querySelector('#plot');

if (plot) {
  let fig = new Figure();

  fig.dsNA('TTTTCTGAGCTAATCAATTTTCAGAACGAGGGCCACGAATGTCAGTGTCAGTGCGGCAGTTGTAAGAACAACGAGCAGTGTCAGAAGTCTTGCAGTTGTCCTACCGGATGCAATTCTGATGATAAGTGTCCATGTGGCAATAAATCCGAGGAGACGAAGAAAAGTTGTTGTAGTGGTAAGGGCGGCGGCGGATCCGGAGGAGGTGGATCGGGCGGCGGTGGGTCGTTCTCAGAGCTGATAAACTTCCAAAACGAGGGACACGAGTGCCAGTGCCAGTGCGGATCGTGCAAGAACAACGAGCAGTGCCAGAAGTCATGCTCCTGCCCCACCGGCTGCAACAGCGACGACAAGTGCCCGTGCGGAAACAAGTCCGAGGAGACAAAGAAGAGTTGCTGCTCCGGGAAG');
  fig.residues('FSELINFQNEGHECQCQCGSCKNNEQCQKSCSCPTGCNSDDKCPCGNKSEETKKSCCSGKGGGGSGGGGSGGGGSFSELINFQNEGHECQCQCGSCKNNEQCQKSCSCPTGCNSDDKCPCGNKSEETKKSCCSGK');

  fig.annotate(0, 180, 'CUP1.1');
  fig.annotate(180, 45, 'Linker L1');
  fig.annotate(180 + 45, 180, 'CUP1.2');

  fig.axis(180 * 2 + 45);

  let ctx = fig.render();
  plot.appendChild(ctx.element);
}

*/
