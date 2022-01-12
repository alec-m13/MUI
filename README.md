# MUI

The assignment is to make a mock swapping app in React. This is my first React project so it took some time to figure out. I focused more on the scripting side than the styling so some elements are not correctly positioned/sized but the functionality is there and that's what's important.

In my projects I typically try to minimize manual initialization. Case in point: how should the crypto data get initialized? Instead of hard coding all the data (names, symbols, rates, etc), this app pulls that data from CoinGecko. All of this is done in the file `src/utility/crypto`. The only manual initialization is right at the top about icon locations; all the data is pulled dynamically. The raw response with many thousands of crypto data is filtered by checking whether an icon is declared for that crypto's symbol and then the rest of the data is automaically fetched and formatted as well.

# Serve

I have been running this app with the following command:

```
npm run dev
```
