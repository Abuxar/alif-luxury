const fs = require('fs');
const path = require('path');

function walk(d) {
    let r = [];
    fs.readdirSync(d).forEach(f => {
        f = path.join(d, f);
        if (fs.statSync(f).isDirectory()) r = r.concat(walk(f));
        else if (f.endsWith('.tsx')) r.push(f);
    });
    return r;
}

const files = walk('./src/components');
let count = 0;

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    const o = c;

    c = c.replace(/\b(-?)ml-(\d+|px|auto|\[.*?\])\b/g, '$1ms-$2');
    c = c.replace(/\b(-?)mr-(\d+|px|auto|\[.*?\])\b/g, '$1me-$2');
    c = c.replace(/\b(-?)pl-(\d+|px|\[.*?\])\b/g, '$1ps-$2');
    c = c.replace(/\b(-?)pr-(\d+|px|\[.*?\])\b/g, '$1pe-$2');
    c = c.replace(/\btext-left\b/g, 'text-start');
    c = c.replace(/\btext-right\b/g, 'text-end');
    c = c.replace(/\bborder-l(-| |\b)/g, 'border-s$1');
    c = c.replace(/\bborder-r(-| |\b)/g, 'border-e$1');
    c = c.replace(/\brounded-l(-| |\b)/g, 'rounded-s$1');
    c = c.replace(/\brounded-r(-| |\b)/g, 'rounded-e$1');

    if (c !== o) {
        fs.writeFileSync(f, c);
        count++;
    }
});

console.log('Updated ' + count + ' files for RTL support.');
