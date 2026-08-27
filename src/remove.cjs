const fs = require('fs');
const appPath = 'd:/TOUR AND TRAVEL/frontend/src/App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');
appCode = appCode.split(' style={{ mixBlendMode: "multiply" }}').join('');
fs.writeFileSync(appPath, appCode);
console.log('Removed mixBlendMode');
