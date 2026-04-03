import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('PDF default type:', typeof pdf.default);
console.log('PDF keys:', Object.keys(pdf));
