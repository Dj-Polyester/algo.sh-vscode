# algo.sh core

Core functionality of the project.

## Steps for installation

1. `npm i` or `npm install`
2. Install PostgreSQL, and create a database with any name: `dbname`
3. Create a `.env` file in the root of the file tree, with the contents below:

```
PGUSER=dbuser
PGPASSWORD=dbpass
PGDATABASE=dbname
PGTABLE=dbtable
```

Note that `dbuser` is your username, `dbpass` is your password. `dbname` is the name
of the database you created.`dbtable` can be anything.

## Testing

`npm test`

## Help needed

We need your help. algo.sh requests entries from [cht.sh](https://cht.sh/)
for now. However, the entries may contain inaccurate results. We aim on giving more flexibility
to users. Please consider contributing to the project with your own code.
