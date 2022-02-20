# mobtimeplus

The mobtimeplus application was forked form the opensource "mobtime" timer here.  The creator and maintainer of this project is mrozzbarry.  
We love this app and decided to build our own that consolidates information into fewer tabs and adds certain capability.

jcssilberman and ethanstrominger are leads for mobtimeplus.

See https://docs.google.com/document/d/1x7Q7gj5T2reQHIb8eQARVer2ygMMT3j9ifAESlMUuVI/ for current information on mobtime plus.  We chose google docs over github for notes as google docs provides WYSIWYG and a less constrained viewing area when editing. 

# Original README

This README needs to be updated for mobtimeplus.

A websocket powered, collaborative mobbing timer, for desktop and mobile.

## Running Locally

### With Docker/Docker Compose

This is probably the preferred way, so yo udon't need to global install redis or even a specific node version.

 - `docker-compose build`
 - `npm run start:dev`

### On your system

I'd only use this if you are using `nvm` or similar for node version management, and are okay with running a local redis server.

 - Install NodeJS LTS (>= v16.x officially, 12.x may still work though)
 - Install and run redis server
     - OSX+homebrew: `brew install redis`
     - Ubuntu: `sudo apt install redis-server`
     - Or google for your operating system's install instructions
 - `npm install`
 - `npm run tailwind`
 - `npm run start:dev`

### Configuration with .env

See [.env.example](./.env.example) for information on environment variables.

## Tips for running in production

 - Ensure `NODE_ENV` is set to production
 - Use `npm start` rather than `npm run start:dev`
 - Surprise find: If you are using phusion passenger to run your node application, you cannot use clustering

## Contributing

Bug reports and suggestions are welcome, just create an issue. PRs are welcome, too.

## License

It's under [MIT](./LICENSE.md).
