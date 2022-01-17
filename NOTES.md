# Notes

- Cookies in client role: https://stackoverflow.com/questions/33506393/node-js-cookie-with-request-jar
- Module Types: https://stackoverflow.com/questions/57492546/what-is-the-difference-between-js-and-mjs-files

## Scrapers

- Stash: https://github.com/stashapp/CommunityScrapers

## DLNA / UPNP / Spec

- Other formats than MP4-based: https://github.com/evands/plex/blob/00e8ffff3e3cc270341b4a10610ab649bf5186c0/xbmc/UPnP.cpp#L361

## Distribute

- https://www.electronjs.org/docs/v14-x-y/tutorial/quick-start#package-and-distribute-your-application

## Development

run the app:

    SET DEBUG=dlna-proxy:* & npm start

## Packaging

https://www.electronjs.org/docs/v14-x-y/tutorial/quick-start#package-and-distribute-your-application

```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```