# M3U to HTML

Well, kind of.

A friend needed to convert a channel list from `m3u` to `HTML` so I did "this project" on the plane quickly.

## Features

- Upload a `.m3u` file
- Sort the channels by group
- Filter with search
- And copy the link easily with 1 click on the button

> You can use the example file to see how it works

## Advice when you have a long list

Open the inspector and the line below to remove all the channels from the filter. Then save the website locally and you don't have to come back to the tool.

```
document.querySelectorAll('li[style*="display: none;"]').forEach(e => e.remove());
```

## Is it bullet-prof?

I don't know. I've never used `.m3u` lists so I don't know if the parameters I'm using are the standard ones.

The format I'm using is:

```
#EXTINF:-1 tvg-name="CHANNEL 1" tvg-logo="" group-title="LOCAL"
http://example.com/example
```

On `main.js` you can edit `keysToParse` in case you have different ones or the splitBy (`#EXTINF:-1`)

## Suggestions

More than welcome. Just create a PR but bear in mind I did this project pretty fast and obviously, the code could be cleaner and better

## Thanks

I've used `primer.css` from Github because is super cool. So thanks
