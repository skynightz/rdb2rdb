const pack = require("../package.json");
const yargs = require("yargs");

yargs
  .scriptName("rdb2rdb")
  .usage(
    `📋 rdb2rdb CLI v${pack.version} 📋
Usage:
rdb2rdb clone db.server-1.com unit db.server-2.com unit
* this cmd clone a rethink db to an other host
`
  )
  .command(
    "clone <srcHost> <srcDb> <dstHost> <dstDb>",
    `clone a rethink db from one host to another host
	`,
    (y) => {
      y.positional("srcHost", {
        describe: "source host rethinkdb server",
      });
      y.positional("srcDb", {
        describe: "source db name",
      });
      y.positional("dstHost", {
        describe: "destination host rethinkdb server",
      });
      y.positional("dstDb", {
        describe: "destination db name",
      });
    },
    (argv) => {
      if (!argv.srcHost || !argv.srcDb || !argv.dstHost || !argv.dstDb) {
        console.log(`Unable to launch the script, missing arguments !`);
        return;
      }
      const srcHost = argv.srcHost.split(":");
      const dstHost = argv.dstHost.split(":");
      const sourceDatabase = {
        host: srcHost[0],
        port: srcHost[1] || 28015,
        db: argv.srcDb,
      };
      const destinationDatabase = {
        host: dstHost[0],
        port: dstHost[1] || 28015,
        db: argv.dstDb,
      };
      require("./main.js")(sourceDatabase, destinationDatabase);
    }
  )
  .help()
  .demandCommand(1, "").argv;
