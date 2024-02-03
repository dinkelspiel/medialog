# Medialog Backend

## Run

_Copy the .env.example to .env and configure it to your liking_

`composer install` <br/>
`pnpm install` <br/>

`./vendor/bin/sail up` <br/>
`./vendor/bin/sail artisan key:generate` <br/>
`./vendor/bin/sail artisan migrate` <br/>

`pnpm dev` <br/>

Now you can connect to the host set in the .env by default `localhost`
