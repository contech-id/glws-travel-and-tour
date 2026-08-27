const fs = require('fs');
const appPath = 'd:/TOUR AND TRAVEL/frontend/src/App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

appCode = appCode.replace(/Ganes Tour/g, 'PT. Ganes Lancar');
appCode = appCode.replace(/Ganes/g, 'PT. Ganes Lancar');
appCode = appCode.replace(/PT\. PT\. Ganes Lancar Lancar/g, 'PT. Ganes Lancar');
appCode = appCode.replace(/PT\. PT\. Ganes Lancar/g, 'PT. Ganes Lancar');
appCode = appCode.replace(/PT\. Ganes Lancar Tour/g, 'PT. Ganes Lancar');
appCode = appCode.replace(/hello@PT\. Ganes Lancartour\.com/g, 'hello@ganeslancar.com');

const colorReplacements = {
  'bg-[#0aa7e5]': 'bg-primary',
  'hover:bg-[#078fc5]': 'hover:bg-primary/90',
  'text-[#0a9edb]': 'text-primary',
  'text-[#079edb]': 'text-primary',
  'border-[#1bb4ed]': 'border-primary',
  'text-[#10a6e1]': 'text-primary',
  'bg-[#10a6e1]': 'bg-primary',
  'bg-[#10a6e1]/10': 'bg-primary/10',
  'text-[#69d0f5]': 'text-secondary',
  'text-[#6fd4f6]': 'text-secondary',
  'text-[#36c5f4]': 'text-primary'
};

for (const [oldClass, newClass] of Object.entries(colorReplacements)) {
  appCode = appCode.split(oldClass).join(newClass);
}

appCode = appCode.replace(
  /border border-gray-100/g,
  'border border-gray-200/50'
);

if (!appCode.includes('logo-glws.png')) {
  appCode = appCode.replace(
    /import tripLake from '\.\/assets\/trip-lake\.jpg'/,
    "import tripLake from './assets/trip-lake.jpg'\nimport logoImage from './assets/logo-glws.png'"
  );
}

appCode = appCode.split('<span className="text-white">PT. Ganes Lancar</span>').join('<img src={logoImage} alt="PT. Ganes Lancar Logo" className="h-10 w-auto" style={{ mixBlendMode: "multiply" }} />');
appCode = appCode.split('<span>PT. Ganes Lancar</span>').join('<img src={logoImage} alt="PT. Ganes Lancar Logo" className="h-10 w-auto" style={{ mixBlendMode: "multiply" }} />');
appCode = appCode.split('<span className="text-lg font-black tracking-tighter text-[#121820]">PT. Ganes Lancar</span>').join('<img src={logoImage} alt="PT. Ganes Lancar Logo" className="h-8 w-auto" style={{ mixBlendMode: "multiply" }} />');
appCode = appCode.split('<span className="text-lg font-black tracking-tighter text-white">PT. Ganes Lancar</span>').join('<img src={logoImage} alt="PT. Ganes Lancar Logo" className="h-8 w-auto" style={{ mixBlendMode: "multiply" }} />');

fs.writeFileSync(appPath, appCode);

const articlePath = 'd:/TOUR AND TRAVEL/frontend/src/data/articleData.json';
let articleData = fs.readFileSync(articlePath, 'utf8');
articleData = articleData.replace(/Ganes Tour/g, 'PT. Ganes Lancar');
fs.writeFileSync(articlePath, articleData);

console.log('Replacement complete.');
