const bcrypt = require("bcrypt");

const password = process.argv[2];
if (!password) {
  console.log("Usage: node scripts/hash.js <password>");
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
})();
