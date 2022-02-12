# Notes

- Cookies in client role: https://stackoverflow.com/questions/33506393/node-js-cookie-with-request-jar
- Module Types: https://stackoverflow.com/questions/57492546/what-is-the-difference-between-js-and-mjs-files

## ESM vs CommonJS
- https://github.com/sindresorhus/got/issues/1789
- https://stackoverflow.com/a/62749284
- Electron:
    - https://github.com/electron/electron/issues/21457
    - https://stackoverflow.com/a/70658025
    - https://stackoverflow.com/a/63792017
    - https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs

## Pipelines / Streams
- https://nodejs.org/es/docs/guides/backpressuring-in-streams/
- https://dev.to/morz/pipeline-api-the-best-way-to-handle-stream-errors-that-nobody-tells-you-about-122o

## Networking
- Use of Agents: https://stackoverflow.com/a/64208818

## Scrapers

- Stash: https://github.com/stashapp/CommunityScrapers

## DLNA / UPNP / Spec

- Other formats than MP4-based: https://github.com/evands/plex/blob/00e8ffff3e3cc270341b4a10610ab649bf5186c0/xbmc/UPnP.cpp#L361

## Electron
- IPC: https://www.electronjs.org/docs/latest/tutorial/ipc

## Distribute

- https://www.electronjs.org/docs/v14-x-y/tutorial/quick-start#package-and-distribute-your-application

## Development

run the app:

    SET DEBUG=vr-streaming-proxy:* & npm start

reset npm cache:

    npm cache clean --force

## Packaging

https://www.electronjs.org/docs/v14-x-y/tutorial/quick-start#package-and-distribute-your-application

```
npm install --save-dev @electron-forge/cli
npx electron-forge import

npm run make
```

## Misc
- Rest syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals