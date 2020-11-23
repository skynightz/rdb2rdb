# rdb2rdb (rethink db to rethink db)

Small CLI tool to clone rethink database from one host to another one. Usage:

```
npx rdb2rdb clone <srcHost> <srcDb> <dstHost> <dstDb>
```

```
<srcHost>  source host rethinkdb server
<srcDb>    source db name
<dstHost>  destination host rethinkdb server
<dstDb>    destination db name
```

## ⚠️ Warning ⚠️

If you are using elastic-search with rethinkdb and your are cloning a database on an existant database, don\'t forget to reset indexes with a curl cmd:

```cmd
curl -X DELETE "<elastic-search-host>:<port>/<dbName>?pretty"
```

And reindex your data after that 👍
