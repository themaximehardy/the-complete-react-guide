# Getting Started

_Useful Resources & Links_

- [Official React documentation](https://reactjs.org/)

### 1. Introduction

React is an amazing library for **creating highly reactive and super fast javascript driven Web applications**. We'll learn it through a real application, we're going to build.

### 2. What is React?

What is React?

> A **JavaScript Library** for building **User Interfaces**

JS library – React Apps run in the user's browser. It means **we don't have to wait for a server response** to get a new page or to render something new.

User Interfaces are basically what the user sees, and React is all about using **components** for building UIs.

Building an UI with components allow us to **build tiny things** on their own (and not the entire web page). It makes **working in teams easier**. And it makes it easy for us to keep our **code manageable**.

> React is **solving the problem of having to build complex UIs with what HTML and JavaScript gives you**; by writing **maintainable**, **manageable** and **reusable** pieces of that code which you can throw into your web app wherever you need to use it.
> _Maximilian Schwarzmüller's_

### 3. Writing our First React Code

Let's go to [codepen.io](https://codepen.io/) and click on create. (Check [Max's code](https://codepen.io/anon/pen/MELQaQ)).

### 4. We Should we Choose React?

1. **UI State becomes difficult to handle with Vanilla JavaScript** – React helps us by making the whole UI state management a non-issue.
2. **Focus on business logic**, not on preventing your App from exploding (+ React is maintained by a big community => framework creators probably write better code).
3. **Huge ecosystem**, **active community**, **high performance**.

### 5. React Alternatives

**Angular** and **Vuejs** are a real alternatives. Not so much **jQuery**.

### 6. Understanding Single Page Applications and Multi Page Applications

|               Single Page Applications                |                          Multi Page Applications                           |
| :---------------------------------------------------: | :------------------------------------------------------------------------: |
| Only ONE HTML page, content is (re)rendered on client |             Multiple HTML pages, content is rendered on server             |
|        Every component is controlled by React         | Static HTML&CSS and a few React components ("widgets") added on some pages |
|      Typically only ONE `ReactDOM.render()` call      |                 One `ReactDOM.render()` call per "widget"                  |
