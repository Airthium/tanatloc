# Contributing

## Start the development version

Requirements:

- `node`
- `yarn`
- `postgresql` or `docker pull postgres`
- `docker pull tanatloc/worker`

Start:

If you use postgres docker:

```bash
id=$(docker container ls -a --filter "name=tanatloc-postgres" -q)
if [ -z ${id+x} ]
then
    mkdir ${HOME}/pgdata
    docker run -d \
        --name tanatloc-postgres \
        -e POSTGRES_PASSWORD=password \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -v ${HOME}/pgdata:/var/lib/postgresql/data \
        postgres
else
    docker restart ${id}
fi
export DB_ADMIN_PASSWORD=password
export DB_HOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps --filter "name=tanatloc-postgres" --format "{{.ID}}"))
export DB_PASSWORD=userpassword
```

- `yarn`
- `yarn prestart`
- `yarn dev`
