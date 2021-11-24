function parseConnectionOptions(connString) {
  let connection = {};
  let upString, hpString;

  let indexOf = connString.lastIndexOf("@");
  // parse user and password (user:password@localhost:28015)
  if (indexOf !== -1) {
    upString = connString.slice(0, indexOf);
    hpString = connString.slice(indexOf + 1);
    indexOf = upString.indexOf(":");
    if (indexOf !== -1) {
      connection.user = upString.slice(0, indexOf);
      connection.password = upString.slice(indexOf + 1);
    }
  } else {
    hpString = connString;
  }

  // parse host and port (localhost:28015)
  const [host, port] = hpString.split(":");
  connection.host = host;
  connection.port = port || 28015;

  return connection;
}

module.exports = { parseConnectionOptions };
