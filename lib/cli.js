const { parseConnectionOptions } = require("./utils.js");
const pack = require("../package.json");
const yargs = require("yargs");

yargs
  .scriptName("rdb2rdb")
  .usage(
    `📋 rdb2rdb CLI v${pack.version} 📋
Usage:
rdb2rdb clone localhost unit localhost unit2
* this cmd clone a RethinkDB to an other host
`
  )
  .command(
    "clone <srcHost> <srcDb> <dstHost> <dstDb>",
    `clone a RethinkDB from one host to another host
	`,
    (y) => {
      y.positional("srcHost", {
        describe: "RethinkDB source host",
      });
      y.positional("srcDb", {
        describe: "source db name",
      });
      y.positional("dstHost", {
        describe: "RethinkDB destination host",
      });
      y.positional("dstDb", {
        describe: "destination db name",
      });
    },
    (argv) => {
      const sourceDatabase = {
        ...parseConnectionOptions(argv.srcHost),
        db: argv.srcDb,
      };
      const destinationDatabase = {
        ...parseConnectionOptions(argv.dstHost),
        db: argv.dstDb,
      };
      require("./main.js")(sourceDatabase, destinationDatabase);
    }
  )
  .help()
  .demandCommand(1, "").argv;
