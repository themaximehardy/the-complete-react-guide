# Redux

_Useful Resources & Links_

- [Redux Docs](https://redux.js.org/)
- [Core Concepts](https://redux.js.org/introduction/core-concepts)
- [Actions](https://redux.js.org/basics/actions)
- [Reducers](https://redux.js.org/basics/reducers)
- [Redux FAQs](https://redux.js.org/faq)

### 1. Introduction

Redux is a **core module** in this course. **Redux** is often used with React but it's a standalone **third party library**. It is a library often used in React projects though to **make state management easier**.

Let's first understand what exactly **state** is and what exactly **Redux** then is and how it works.

### 2. Understanding State

State for example are the **ingredients** we added to our burger, that's part of our application state of our burger builder application. The information, which ingredients we added is crucial because it determines what we need to **render** to the screen, how should our burger preview look like? It's also important behind the scenes when we store that burger on a server and we need to submit all these ingredients in the HTTP request.

Another state, could be – **is the user authenticated?**. That can be super important as it might determine the options we're showing in the menu or the access we're granting to certain components.

Also interesting is **UI statelike** is a given **modal open**, is a backdrop open, should it be open (it's less about data like ingredients and user authentication is, it's more about our pure UI only state)?

_What's now so complex about state? Why do we need extra library for that? Let's take a closer look._

### 3. The Complexity of Managing State

**State management can be very complex** and React is great at reacting to state changes and updating the UI accordingly but managing that state can get very difficult as our application grows.

Of course React gives us the **built-in state property** which we use, but we could already see in our burger builder project that passing the ingredients from component A to component B can be very difficult and we had to use _routing query parameters_ for that, certainly a **workaround** but not a very elegant one.

![state-management](../img/s14/14-1-state-management.png 'state-management')

The problem now is what if we all need that information in a totally different area of our app...

![state-management](../img/s14/14-2-state-management.png 'state-management')

Well that is super complex and a very long chain of props or query params we manage to pass data around.

![state-management](../img/s14/14-3-state-management.png 'state-management')

It's a pity that it is this difficult because in the end, we're writing JavaScript and we're having a bundled JavaScript file as output (or a couple of bundles if we're using lazy loading). **Why can't we just set some global variable** which is a **JavaScript object** which **stores our entire application state** and which **we can access from anywhere**?

The reason is that React's reactivity system doesn't react to changes in some global variable you defined and it's good that it doesn't. That makes React so efficient. However, having this global store still sounds very interesting and that's exactly what Redux is about as we will learn.

### 4. Understanding the Redux Flow

How does redux work? Well remember that idea of having some central place where we manage the entire state... we said that we can't use a global variable for that and we can't! But Redux gives us a certain flow of data (= a certain way of managing data) that we can nicely integrate with another package into our react app, so that React does react to changes of data.

Let's describe how Redux works. How does it manage data and how does it update it? In the end, it's all about a **central store** we have in each Redux application.

_Note: Redux is a third party library which works totally independent of React, it's most often seen in conjunction with React but theoretically, it's independent._

So it's all about a **central store**, this store stores the **entire application state**, it's that simple, we can think about it as a **giant JavaScript object**.

In a React application **we've got components** and a component probably **wants to manipulate or get the current application state**, now it **doesn't do that by directly manipulating that central JavaScript object**, that would n**ot be picked up by React's reactivity** system and even worse, it would make our **store pretty unpredictable**. If we added it from anywhere in our application, that we can never see where we made a certain change that broke our app, for example. So we need to have **a clear, predictable process of updating the state** on which we can rely on and which is the **only process** that can change our state.

That is actually what **Redux** is all about, having a clearly defined process of how your state may change.

#### ACTIONS (= **messenger**, with a `type` and sometimes a `payload`)

The first building block besides the central store are **actions** which are **dispatched** from our JavaScript code, in a react app, they are **dispatched from within your components**. And action is _just information package in the end_ with a **type** (kind of a description), something like `addIngredient` or `removeIngredient`. Possibly, it also holds a **payload**, for example if the action is `addIngredient`, we need to also pass the information which ingredient and that would also be a part of the action.

So it's an information package we're sending out to the world or to Redux to be precise, that action doesn't directly reach the store, that action **doesn't hold any logic**, it **doesn't know how to update the store**, **it's just a messenger**.

#### REDUCERS

The part which change the store is a **reducer**. We'll end up with one route reducer which is directly connected to our store in the end. So the **action reaches the reducer** and since the action contains a **type**, the **reducer can check the type of the action**. For example if it's `addIngredient` and we then define the code for that type of action in the reducer. The reducer in the end is _just a pure function_ which receives **the action and the old state as input** and which then **returns an updated state**. The important thing is that the **reducer has to execute synchronous code only**, _no asynchronous code, no side effects, no HTTP requests,..._ We'll learn later how we can still implement asynchronous code but in reducers, it's just input in, output out, nothing in between, no delay.

The reducer returns the updated state which then is stored in the store and replaces the old state and that **has to be done in an immutable way**, so **we always return a new state which can be based on the old one but which is technically a new JavaScript object**, because objects are reference types in Javascript and we want to make sure that we don't accidentally change the old one.

This is how the reducer handles the action, now the store is up to date. How do we get the updated state back into our component then? For that, we use a **subscription model**.

#### SUBSCRIPTION

The store triggers all subscriptions whenever the state changes, whenever the state is updated in the store. And of course our component can subscribe to store updates and it then receives that update automatically, this is how simple it is. It works through a subscription model and we simply say: "hey I want to get notified whenever the state changes", just as we say: "hey I want to change the state, here is an action describing my plans".

This is the redux flow, this is how redux works.

![redux-flow](../img/s14/14-4-redux-flow.png 'redux-flow')

### 5. Setting Up Reducer and Store

### 6. Dispatching Actions

### 7. Adding Subscriptions

### 8. Connecting React to Redux

### 9. Connecting the Store to React

### 10. Dispatching Actions from within the Component

### 11. Assignment 4 – Dispatching Actions

### 12. Passing and Retrieving Data with Action

### 13. Switch-Case in the Reducer

### 14. Updating State Immutably

### 15. Updating Arrays Immutably

### 16. Immutable Update Patterns

### 17. Outsourcing Action Types

### 18. Combining Multiple Reducers

### 19. Understanding State Types

### 20. Assignment 5 – Redux Basics

### 21. Combining Local UI State and Redux
