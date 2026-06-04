const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/generators/backend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const f of files) {
  const filePath = path.join(dir, f);
  let text = fs.readFileSync(filePath, 'utf8');
  
  // Replace the bad interpolation
  text = text.replace(/\$\{getFirstRequiredField\(spec\.inputSchema\)\}/g, "${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}");
  
  fs.writeFileSync(filePath, text);
}
console.log("Fixed 10 backend generators.");
