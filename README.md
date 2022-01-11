# MUI

The assignment is to make a mock swapping app in React. This is my first React project so it took some time to figure out.

I'm picking up React quickly enough to finish in time but the product is not particularly stellar. My experience is in vanilla JS/TS and I wanted to showcase that a little. I made some functionality in the utilities folder with concepts I am used to working with, specifically `src/utility/crypto.tsx`.

In my projects I typically try to get all the manual initialization done in one location (and to minimize how much is necessary). For this project the only manual setup of crypto data is the importing of crypto icons and collating them into one object (right at the top of `cryptos.tsx`). The app then fetches all the cryptos listed by CoinGecko, keeps only those for which there is an icon manually declared above, and then fetches the current cost of those tokens again from CoinGecko.

The transaction details slide is not fully functional -- I haven't properly hooked in calcualtions for those values. But that's partly because I'm not completely sure where those values are suppsoed to come from so I feel ok hard-coding them in for now on this practice app.

# Serve

I have been running this app with the following command:

```
npm run dev
```
