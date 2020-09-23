# Debugging React Apps

_Useful Resources & Links_

- [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [Chrome Devtool Debugging](https://developers.google.com/web/tools/chrome-devtools/javascript/)

### 1. Introduction

How can we debug our React App? And how you should read and understand the React error messages?

### 2. Understanding Error Messages

We have a **clear message on the top of the error** and then the details about our stack trace – `Uncaught TypeError: Cannot read property 'value' of undefined`.

The second line `at App._this.nameChangedHandler (App.js:34)` gives us **a clue about the line and the file**.

```
Uncaught TypeError: Cannot read property 'value' of undefined
    at App._this.nameChangedHandler (App.js:34)
    at changed (App.js:60)
    at HTMLUnknownElement.callCallback (react-dom.development.js:188)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:237)
    at invokeGuardedCallback (react-dom.development.js:292)
    at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:306)
    at executeDispatch (react-dom.development.js:389)
    at executeDispatchesInOrder (react-dom.development.js:414)
    at executeDispatchesAndRelease (react-dom.development.js:3278)
    at executeDispatchesAndReleaseTopLevel (react-dom.development.js:3287)
    at Array.forEach (<anonymous>)
    at forEachAccumulated (react-dom.development.js:3257)
    at runEventsInBatch (react-dom.development.js:3304)
    at runExtractedPluginEventsInBatch (react-dom.development.js:3514)
    at handleTopLevel (react-dom.development.js:3558)
    at batchedEventUpdates$1 (react-dom.development.js:21871)
    at batchedEventUpdates (react-dom.development.js:795)
    at dispatchEventForLegacyPluginEventSystem (react-dom.development.js:3568)
    at attemptToDispatchEvent (react-dom.development.js:4267)
    at dispatchEvent (react-dom.development.js:4189)
    at unstable_runWithPriority (scheduler.development.js:653)
    at runWithPriority$1 (react-dom.development.js:11039)
    at discreteUpdates$1 (react-dom.development.js:21887)
    at discreteUpdates (react-dom.development.js:806)
    at dispatchDiscreteEvent (react-dom.development.js:4168)
```

### 3. Finding Logical Errors by Using Dev Tools & Sourcemaps

When the **error is logical**, it **can be trickier to debug it**. Open the Dev tools in Chrome, then go to `Sources`. Open the panel on the left and we can see the **source maps** which are generated. _Basically we could say, it is a translation of our files allowing the browser Dev tools to go into our code as we wrote it and allow us to debug that code even though the code which is shipped to the browser will be a different one_, an optimized and bundled one. This is pretty cool because we can debug the code we wrote even though it's not the code running in the browser.

Then we can place a breakpoint into the code and start debugging it.

### 4. Working with the React Developer Tools

Let's install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en).

### 5. Using Error Boundaries (React 16+)

Sometimes, we have code which might fail at runtime and we know that but we can't guarantee that it always works. In this case we probably want to show a nice screen or at least a custom error message to the user.

```js
// src/ErrorBoundary/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    errorMessage: '',
  };

  componentDidCatch = (error, info) => {
    this.setState({ hasError: true, errorMessage: error });
  };

  render() {
    if (this.state.hasError) {
      return <h1>{this.state.errorMessage}</h1>;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
```

```js
// src/App.js
import React, { Component } from 'react';
import Person from './Person/Person';
import classes from './App.css';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

class App extends Component {
  //...

  render() {
    let persons = null;
    let btnClass = [classes.Button];

    if (this.state.showPersons) {
      persons = (
        <div>
          {this.state.persons.map(({ id, name, age }, index) => {
            return (
              <ErrorBoundary key={id}>
                <Person
                  click={() => this.deletePersonHandler(index)}
                  name={name}
                  age={age}
                  changed={(event) => this.nameChangedHandler(event, id)}
                />
              </ErrorBoundary>
            );
          })}
        </div>
      );
      btnClass.push(classes.Red);
    }

    //...

    return (
      <div className={classes.App}>
        {...}
      </div>
    );
  }
}

export default App;
```

Basically **only use it if we have some code we know that it may fail**, we souldn't wrap any other code because if normal code fails, we as a developer probably made a mistake during development.
