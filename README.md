# MUI

The assignment is to make a mock swapping app in React. This is my first React project so it took some time to figure out.

I'm picking up React quickly enough to finish in time but the product is not particularly stellar. My experience is in vanilla JS/TS and I wanted to showcase that a little. I made some functionality in the utilities folder with concepts I am used to working with. For example, `crypto.tsx` takes an array of initialization data and makes a model of crypto data (the three available currencies) for this project to use.

In my projects I typically try to get all the manual initialization done in one location (and to minimize how much is necessary) and for this project it's all done in that one `cryptoDefs` array + the icon imports above it. Adding functionality for new coins consists of adding just one more parameter-object there. The code takes it from there, even figuring out which parameters can be used as crypto identifiers (i.e. names/keys) and setting up corresponding data structures automatically.

This is the type of front-end integration where I really excel -- automating environment setup and the like. I can do classic front-end logic too but at the moment my progress is in that direction slowed by having to simultaneously pick up React. But I'm still making progress.
