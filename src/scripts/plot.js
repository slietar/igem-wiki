import Figure from '../../dna/circular/figure';


let target = document.querySelector('#plot-plasmid');

if (target) {
  let fig = new Figure(6690);

  fig.plasmid('pCTcon2_V5', '6690 bp');
  fig.axis();

  fig.annotate(71, 503, 'cen/ars');

  fig.annotate(610, 44, 'amp promoter', { level: 2 });
  fig.annotate(714, 862, 'ampR', { direction: 'forward' });

  fig.annotate(1746, 588, 'ColE1');
  fig.annotate(2757, 848, 'Gal1 promoter');
  fig.annotate(3698, 207, 'Aga2', { level: 0 });

  fig.annotate(3644, 54, 'secretion signal', { level: 2 });
  fig.annotate(4025, 406, 'dimer', { level: 0 });
  fig.annotate(4436, 42, 'V5', { level: 1 });
  fig.annotate(4997, 455, 'f1 ori');

  fig.annotate(5549, 675, 'TRP', { direction: 'reverse' });
  fig.annotate(6223, 282, 'TRP promoter', { direction: 'reverse', level: 1 });

  let ctx = fig.render();
  target.replaceWith(ctx.element);
}
