const fs = require('fs');
const appPath = 'd:/TOUR AND TRAVEL/frontend/src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// Bright blues to replace with '-secondary'
const brightBlues = ['#078fc5', '#0796ce', '#079ee0', '#087eb0', '#0a9edb', '#0aa7e5', '#0ba7e7', '#1096c7', '#10a6e1', '#12a8e3', '#159ee1', '#36c5f4', '#69d0f5', '#6fd4f6'];

// Light blues to replace with '-secondary/20' or similar if they are backgrounds
const lightBlues = ['#a9ddf4', '#dff4fc', '#e6f5fb', '#e8f7fd', '#eaf7fc', '#eaf8fd', '#eef7fb', '#eef9fd', '#effaff', '#f1f7fa', '#f3f8fb', '#f3f8fc', '#f4f8fa'];

brightBlues.forEach(hex => {
    // replace exact hex codes inside brackets
    code = code.split(`[${hex}]`).join('secondary');
});

lightBlues.forEach(hex => {
    // replace light hex codes inside brackets
    code = code.split(`[${hex}]`).join('secondary/15');
});

fs.writeFileSync(appPath, code);
console.log('Blue colors replaced with secondary.');
