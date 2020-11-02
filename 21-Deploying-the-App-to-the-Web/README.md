# Deploying the App to the Web

### 1. Introduction

Now it's time to deploy this application so that we can really see it run somewhere in the internet. So deploying React apps, how does that work?

### 2. Deployement Steps

**Which steps do we need to follow when we deploy a React app?**

![deployment-steps](../img/s21/s21-1-deployment-steps.png 'deployment-steps')

First of all we need to check and possibly adjust the **base path**, this is only important when we use the `react router` and there when wrapping the app in the `BrowserRouter`, we can set our `basename` property. That is always required when our app is served from something else than the root route, the route domain. If we're serving our app from `example.com/my-app`, then you'll need to set the basename to my app for the router to work correctly.

The second important thing is that we need to **build an optimized project**, this is done with one convenient command in our application, `npm run build` in create react app projects. That will automatically build the project and optimize all our JavaScript bundles to have a very small codebase we then actually will upload on a server, because we obviously want to ship as little code as possible since that will be as fast as possible.

Now another important thing to keep in mind is o**ur server must always serve the `index.html` file also and especially in 404 cases**, that's required due to the way the internet works. If our user visits `my-app.com/users`, then the server is the first to receive that route and chances are the server doesn't know the `/users` path because we defined it in our React app. Now for that to not throw an error, our React app needs to get a chance of parsing the path and it only does so if we return the `index.html` file for that unknown route, it is unknown to the server in the end. So always return `index.html` in **404 cases** otherwise our routing dependent React applications won't work.

Finally **upload the build artefacts** we get from the second step, build and optimize the project to a static server, we don't need a server running PHP or Nodejs or anything like that. In the end, what we will deploy here is a **single page app** consisting of **html** and **a little bit of css** and **a lot of JavaScript**, none of that needs a server side language, so **a static server** like _AWS S3_, _Github pages_ or _Firebase_ or any other server will do and **we just upload the build artefacts, not our entire project folder**. The build artefacts will be stored in a `/build` folder... That is how easy it is to deploy our React application.

### 3. Building the Project

We need to ensure that the server always returns to `index.html` file, that is something all static hosts typically allow us to configure and if we're not using a static host but we are using our Nodejs server, we just need to write code, we need to set up a catch all route and return `index.html`.

```sh
# yarn build

yarn run v1.17.3
$ node scripts/build.js
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  71.94 KB  build/static/js/main.abb29622.js
  3.33 KB   build/static/js/0.933c525e.chunk.js
  2.71 KB   build/static/js/1.58497cc1.chunk.js
  2.49 KB   build/static/css/main.46017d3e.css
  1.56 KB   build/static/js/2.bbedf4b6.chunk.js
```

This will now build our project, similar to `npm start` but now **it will also spit out a folder** and **not just store the result in memory** and that folder will **contain our optimized production build**.

So there, we get this new build folder which is our single page which also is optimized to consume as little space as possible. We'll see that some script imports were added there, like to this main js file and that is what we can find in the static folder, there we got our media files, images like the burger logo and the JavaScript files for our different chunks for lazy loading and the main js file.

The content of the build folder, ship that content, all the files there and the static folder to our static host.

![build-folder](../img/s21/s21-2-build-folder.png 'build-folder')
