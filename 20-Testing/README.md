# Testing

_Useful Resources & Links_

- [Enzyme API](http://airbnb.io/enzyme/docs/api/)
- [Jest Docs](https://facebook.github.io/jest/)

### 1. Introduction

Let's test our application... **writing automated tests**! Testing is a complex topic and is actually a huge enough topic to make up an entire course just on its own. We're going to introduce into writing unit tests for React applications built with create React app and that can then be something we build up on or which helps we apply our general JavaScript testing knowledge we already have or gathering other resources.

### 2. What is Testing?

So what we typically do when we build an application. (1) We build our App, (2) We test it manually in the browser, (3) We create automatic tests and then (4) we ship our App to a server. Now these are tests which run automatically, we write them and then each test tests a tiny fraction of our application, that's a so-called **unit test**, it tests a unit of our app.

The idea behind such tests is that since we define these tests, if we change anything in our application and that breaks our app or breaks a component in our app then the respective test will fail and hence we might get a warning about a potential error we introduced before we even have to find it by manually testing the browser. In more complex applications, this is especially important since there, it's way easier to break something without quickly noticing it.

![simple-sdlc](../img/s20/s20-1-simple-sdlc.png 'simple-sdlc')

There also is a different way of thinking about testing, instead of adding it in the end of the build workflow, there also is this idea of **test driven development** where we import the tests first, there we write the tests before we write any application code and therefore all the tests will of course fail initially but then we add the application code and the test should pass step by step.

**Why would we test?**

Well that is exactly what we already mentioned, we might have an application and there, we might have a component which does a couple of things as suggested here (below). In the first draft we created for the component, it may pay us all the tests we defined for this given component so we wrote test for a given component and they pass.

![test-fail-example](../img/s20/s20-2-test-fail-example.png 'test-fail-example')

Now when we change something in this application or we add a new feature and that affects this component and we change something in that component for that reason then we still might have some passing tests but maybe some of our tests then fail and that's exactly showing us then where we need to look into our code and potentially fix or adjust it or fix or adjust our test to the changed requirements, either of the two, but at least we have to take a look at that so that's the idea behind testing. Now to be able to test, we need some testing tools.

### 3. Required Testing Tools

We need **two tools to write good tests** and be able to test our React application.

The first tool is the **test runner**, this is basically a tool which is responsible for executing our tests, so for running the code, test code and providing a validation library which in the end is a library which allows us to do comparisons and potentially throw some errors. The idea behind **unit tests** is that **they don't run in the browser** but instead with **Nodejs though often emulated to be in a browser environment** with the help of specific JavaScript packages.

The test runner is the core tool which simply executes our code using that environment and the good thing is `create react app` already comes with a **pre-configured testing environment** we can build up on.

We will use `jest` in this course, `jest` is already installed in the app created with `create react app` and is a popular JavaScript testing tool which is not limited to React but often used in React apps.

Now, running the test is one thing, when working with React components, we also need a way of emulating these components, so basically mounting them to some "non-existent dom", then traversing our components and we want to do this in an efficient quick way without having to actually create that whole component tree which might also introduce some side effects.

For this, we need **testing utilities** which help us to **simulate the React app**, **mount components** and dig into that dom which is created with React. We're going to use `enzyme`. `enzyme` is a tool developed by AirBnB, they use React in a lot of their projects and they share this tool which makes it easy to mount components and then navigate through them and I will of course show we how to use both tools, `jest` and `enzyme` here.

![testing-tools](../img/s20/s20-3-testing-tools.png 'testing-tools')

### 4. What to Test?

Now, we know which tools we use and why testing in general is a good idea, we of course have to find out **what we should test** and there, the answer is straightforward.

Actually **writing good tests is quite complex and requires a lot of practice** which is also one of the reasons why this is not a complete testing guide.

here are some things we would not want to test:

- **Don't test a Library!** _we don't want to test React, Axios or Redux itself, these are third party libraries which already were tested by the developers._ We don't need to test if they work correctly, we don't need to test if the Redux store is working correctly, we want to test the code we add to our application and there we want to test the code which does not use that library.

So for example, if we're sending an Axios post request, we don't need to test if that is sent successfully. If it fails, we probably have no internet connection, it's not the Axios library. We typically want to fake data we get back from our server in such a use case and just test what we are doing with such returned data.

- **Don't want to test too complex connections** especially in React, there is the danger of testing when we click a button in one component and we change something in a totally different component. We don't have to test if React is able to use the concept of props to emit an event and pass that on, we would be interested in testing if the button click in our React triggers a specific prop in the first place or if the change in data we receive via props in one component leads to a different result being rendered, that is what we want to test.

_There are some testing guides which goes so far to say for react components, we only need to test if a React component itself is rendered correctly._

What are we going to test then?

- **Do test isolated units**, we want to test that reducer function we created, we want to test that component function we created.

- **Do test our conditional outputs!** If our component has a property which leads to something being rendered if that property is true, then we want to test if this really happens. What happens if some property changes in our component? Does that affect the output correctly?

These are things we want to test in our unit tests.

![what-to-test](../img/s20/s20-4-what-to-test.png 'what-to-test')

### 5. Writing our First Test

### 6. Testing Components Continued

### 7. Jest and Enzyme Documentations

### 8. Testing Components Correctly

### 9. Testing Containers

### 10. How to Test Redux?
