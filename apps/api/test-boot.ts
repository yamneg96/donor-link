console.log('=== TEST BOOT START ===');

try {
  console.log('1. Loading config...');
  const config = require('./src/config');
  console.log('2. Config loaded:', Object.keys(config));
  console.log('3. Env PORT:', config.env?.PORT);
  
  console.log('4. Loading app...');
  const { app } = require('./src/app');
  console.log('5. App loaded successfully');
  
  console.log('=== TEST BOOT SUCCESS ===');
  process.exit(0);
} catch (err: any) {
  console.error('=== BOOT ERROR ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack?.substring(0, 1000));
  process.exit(1);
}
