const fs = require('fs');
try {
  require('./routes/certificate.routes.js');
} catch (e) {
  fs.writeFileSync('err_report.txt', String(e.stack));
}
