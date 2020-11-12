// this is wrapped in an `async` function
// you can use await throughout the function
let nSource = '';
switch(inputData.source) {
  case 'TAB-placement-alternatif-CPL/' : {
    nSource = 'Top Placement- Placement alternatif jusqu\'a 8.5 %';
    break;
  }
  case 'TAB-placement-alternatif-dossier-specia-CPL/' : {
    nSource = 'op Epargne - Placement alternatif jusqu\'a 8.5 %';
    break;
  }
  case 'G-Rem' : {
    nSource = 'Top Placement- Placement alternatif jusqu\'a 8.5 %';
    break;
  }
  case 'TAB-les-gafa-Amazon-CPL/ ' : {
    nSource = 'LIVRET GAFA (APPLE AMAZON FACEBOOK GOOGLE)';
    break;
  }
  default : {
    nSource = 'Top Placement- Placement alternatif';
  }
}
output = [{val: nSource}];