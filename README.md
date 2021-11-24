# rdb2rdb (RethinkDB to RethinkDB)

Small CLI tool to clone RethinkDB from one host to another. Usage:

```
npx rdb2rdb clone <srcHost> <srcDb> <dstHost> <dstDb>
```

```
<srcHost>  RethinkDB source host
<srcDb>    source db name
<dstHost>  RethinkDB destination host
<dstDb>    destination db name
```

> The port **28015** is used by default if you don't specify the port in the host parameter.

## Examples

```
// Simple example
rdb2rdb clone localhost unit localhost unit2

// More complex example with user, password and port
rdb2rdb clone user:password@server.com:28016 unit user:password@server2.com:28016 unit
```

## ⚠️ Warning ⚠️

If you are using Elasticsearch with RethinkDB and your are cloning a database on an existant database, don\'t forget to reset indexes with a curl command:

```cmd
curl -X DELETE "<elasticsearch-host>:<port>/<dbName>?pretty"
```

And reindex your data after that 👍
