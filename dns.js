
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function testDNS() {
  try {
    const records = await dns.promises.resolveSrv(
      "_mongodb._tcp.cluster0.vflhpe1.mongodb.net"
    );

    console.log("DNS working!");
    console.log(records);
  } catch (err) {
    console.error("DNS failed:", err.code, err.message);
  }
}

testDNS();
