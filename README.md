# MUI

The assignment is to make a mock swapping app in React. This is my first React project so it took some time to figure out.

I'm picking up React quickly enough to finish in time but the product is not particularly stellar. My experience is in vanilla JS/TS and I wanted to showcase that a little. I made some functionality in the utilities folder with concepts I am used to working with, specifically `src/utility/crypto.tsx`.

In my projects I typically try to get all the manual initialization done in one location (and to minimize how much is necessary). For this project the only manual setup of crypto data is the importing of crypto icons and collating them into one object (right at the top of `cryptos.tsx`). The app then fetches all the cryptos listed by CoinGecko, keeps only those for which there is an icon manually declared above, and then fetches the current cost of those tokens again from CoinGecko.

That API usage is great, but really the trickiest part is next. After storing all the crypto token data in an array, the app queries that array for any properties which can be used as identifiers for tokens. So each crypto's `name`, `id`, `symbol`; these can be used to uniquely identify a token and the app detects that. It looks for all possible key types then creates a map for each of these key types which takes the key and gives the token's data. That way if we modify the token data format later we won't have to rebuild these key map generators -- the app builds them on its own each time.

This is the type of front-end integration where I really excel -- automating environment setup and the like. I can do classic front-end logic too but at the moment my progress is in that direction slowed by having to simultaneously pick up React. But I'm still making progress.

# Serve

I have been running this app with the following command:

```
npm run dev
```

# Current Direction

Wrapping up the task as a whole.
