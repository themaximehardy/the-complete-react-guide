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

```sh
yarn add enzyme react-test-renderer enzyme-adapter-react-16
```

Let's start by testing a (functional) component, then a container and finally Redux.

1. Functional component – `NavigationItems`, and create in the same folder `NavigationItems.test.js`.

Now we want to create an instance of this component (`<NavigationItems />`) as it would be rendered to the DOM, to the real DOM through React and then have a look into the rendered component and see what was rendered for the case that the `isAuthenticated` prop is `false`.

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
describe('<NavigationItems />', () => {
  it('should render two <NavigationItems /> elements if not authenticated', () => {
    //...
  });
});
```

Now we might think that we need to render the entire React application because `NavigationItems` is just one tiny piece in the entire React application, that is where `enzyme` comes in, this testing package. **Enzyme allows us to just render this navigation items component standalone independent** of the entire other React application, that's the whole idea behind the enzyme package, that **we can really write unit tests**, **isolated tests**, tests where we don't need to render the complete React app.

Let's **import** and **configure** `enzyme`.

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
import { configure } from 'enzyme'; // import configure
import Adapter from 'enzyme-adapter-react-16'; // import Adapter

configure({ adapter: new Adapter() }); // we execute `configure` where we pass an object

describe('<NavigationItems />', () => {
  it('should render two <NavigationItems /> elements if not authenticated', () => {});
});
```

**Shallow** is the best way of rendering React components in many circumstances, `enzyme` offers two alternatives which we'll also talk about later but `shallow` is the one we should use as often as possible because one thing shallow does is it renders the component with all its content **but the content isn't deeply rendered**.

So the `NavigationItems` component here has `NavigationItem` components but these are **only rendered as placeholders**, the content of them isn't rendered and that of course again is important for creating isolated tests where we don't then render a whole sub tree of components, we just want to render this component and know what's inside of it without rendering everything which is nested inside its included components.

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
  it('should render two <NavigationItems /> elements if not authenticated', () => {
    const wrapper = shallow(<NavigationItems />);
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });
});
```

```sh
# yarn test

 PASS  src/components/Navigation/NavigationItems/NavigationItems.test.js
  <NavigationItems />
    ✓ should render two <NavigationItems /> elements if not authenticated (30ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.869s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

### 6. Testing Components Continued

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
  it('should render two <NavigationItems /> elements if not authenticated', () => {
    const wrapper = shallow(<NavigationItems />);
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render three <NavigationItems /> elements if authenticated', () => {
    const wrapper = shallow(<NavigationItems isAuthenticated />);
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });
});
```

Or let's improve this...

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('should render two <NavigationItems /> elements if not authenticated', () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render three <NavigationItems /> elements if authenticated', () => {
    // wrapper = shallow(<NavigationItems isAuthenticated />);
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });
});
```

### 7. Jest and Enzyme Documentations

Look at the docs: **Jest** and **Enzyme** (check the above links).

```js
// src/components/Navigation/NavigationItems/NavigationItems.test.js
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('should render two <NavigationItems /> elements if not authenticated', () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render three <NavigationItems /> elements if authenticated', () => {
    // wrapper = shallow(<NavigationItems isAuthenticated />);
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it('should render three <NavigationItems /> elements if authenticated', () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>),
    ).toEqual(true);
  });
});
```

### 8. Testing Components Correctly

**Writing good tests is complicated**, it's easy to write 100 tests for a given component and test all kind of things while it's missing the one important thing we should have tested and on the other way around. We might only need one test to really verify if a component behaves the way we want it to behave.

The best thing we can do it's practicing and writing a lot of tests for different components, testing for different things no matter if they makes sense to be tested or not, learn how to test how to think in test environments and learn how to use the different functions provided by **Jest** and **Enzyme**.

It really is all about practicing and testing takes experience, the best way to start with testing is to **always have a look at our component or our function** we are testing and **see what are the crucial things that change depending on some external influences** like here, the `isAuthenticated` part which changes what gets rendered.

And then this should be what we write the test for, so that whenever we change something in the navigation items component and we accidentally mess up we got failed tests.

### 9. Testing Containers

We had a look at how we test components, let's now have a look at containers like the `BurgerBuilder`, how do we test these?

The tricky part about containers is that **they are connected to the Redux store** and the Redux store has some external influence on this component. If it weren't connected, testing it would just be very equal to the other components because then yes it might have state but enzyme actually also has methods to handle this, just as we have `setProps`, we also have `setState` to simulate different states in that component. So the **tricky thing really is the Redux store**.

The good thing is we don't really need to test the connection of this container to the Redux store, we can rely on the Redux store to work correctly, and then **in the end we only receive data from the store as props to this container**. So we're back to the previous world, we can just simulate props in our tests because we want to simulate different outcomes in different states of props anyways, so that **we don't want to connect that to some real store**.

So what we really need to do is we need to get access to the component behind this container... and one convenient trick is to simply export this `BurgerBuilder` class, so simply add the export statement in front of this.

```js
//...
export class BurgerBuilder extends Component {...} // export the class
//...
// export the component connected
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios));
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.test.js
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

configure({ adapter: new Adapter() });

describe('<BurgerBuilder />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />);
  });

  it('should render <BuildControls /> when receiving ingredients', () => {
    wrapper.setProps({ ings: { salad: 0 } });
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });
});
```

### 10. How to Test Redux?

We learned how to test containers and we mentioned that the important part is that we don't test the connection to Redux... How do we test Redux then, do we test it at all?

**The answer is yes we test it** but we have to be careful about what we test.

We probably don't want to test very complex chains of actions and reducers and state, **in the end the reducers are the meat we want to test especially if we follow the pattern of not putting too much logic in the action creators**. Then testing reducers is super simple, there's synchronous so we don't have to deal with async code and there are just functions, we pass something in, we get something out.

So we add an `auth.test.js` file, here we don't even need enzyme because we're not testing any React components, we don't need to render anything, we just test normal JavaScript code, we test functions, the reducer function.

```js
// src/store/reducers/auth.test.js
import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/',
    });
  });

  it('should store the token upon login', () => {
    expect(
      reducer(
        {
          token: null,
          userId: null,
          error: null,
          loading: false,
          authRedirectPath: '/',
        },
        {
          type: actionTypes.AUTH_SUCCESS,
          payload: { idToken: 'someIdToken', userId: 'someUserId' },
        },
      ),
    ).toEqual({
      token: 'someIdToken',
      userId: 'someUserId',
      error: null,
      loading: false,
      authRedirectPath: '/',
    });
  });
});
```

This is how we can also test reducers, they are pure functions and therefore very simple to test.
