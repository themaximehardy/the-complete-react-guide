# A Real App: The Burger Builder (Basic Version)

### 1. Introduction

We're going to build a **burger application** so an real application where we can dynamically build a burger, add ingredients and then in the end of course also purchase it. We'll start with the **planning phase**. But how do we plan a React application?

### 2. Planning an App in React - Core Steps

How do we plan a React application?

Here are three very important steps (but we can split these up into more granular steps).

1. **Component Tree / Component Structure**
2. **Application State** (Data)
3. **Components** vs **Containers**

(1) It's super important to have an idea about what should go into its own component and what not.
(2) We can also translate this with the data we plan on using and manipulating in our application. For example, in our burger application, we need to keep track about the ingredients a user added because that will determine what we need to render and also what the user needs to pay in the end.
(3) Which components in our application should be **stateless** (= dumb components) so basically components that are functional and don't use hooks or even class-based components that don't use state. And which components have to be **stateful** components, so either functional components using their useState hook or class-based components using the state property.

### 3. Planning our App - Layout and Component Tree

Application layout:

![app-drawing](../img/s08/8-1-app-drawing.png 'app-drawing')

Component tree:

![app-components](../img/s08/8-2-app-components.png 'app-components')

### 4. Planning the State

What should be a **stateless component** and what should be a **stateful component**.

![app-state](../img/s08/8-3-app-state.png 'app-state')

We should manage the state in the `BurgerBuilder` component (and not the `App` component). The state we just listed is really just related to building a burger. So the burger builder should be a stateful component and the other pages should be stateless.

### 5. Enabling CSS Modules

We're going to use a styling solution named "**CSS modules**". In more recent project versions created by CRA, support for CSS modules is already built-in and we can use that feature without ejecting, [here is more information](https://facebook.github.io/create-react-app/docs/adding-a-css-modules-stylesheet).

### 6. Setting up the Project

### 7. Creating a Layout Component

### 8. Starting Implementation of The Burger Builder Container

### 9. Adding a Dynamic Ingredient Component

### 10. Adding Prop Type Validation

### 11. Starting the Burger Component

### 12. Outputting Burger Ingredients Dynamically

### 13. Calculating the Ingredient Sum Dynamically

### 14. Adding the Build Control Component

### 15. Outputting Multiple Build Controls

### 16. Connecting State to Build Controls

### 17. Removing Ingredients Safely

### 18. Displaying and Updating the Burger Price

### 19. Adding the Order Button

### 20. Creating the Order Summary Modal

### 21. Showing & Hiding the Modal (with Animation)

### 22. Implementing the Backdrop Component

### 23. Adding a Custom Button Component

### 24. Implementing the Button Component

### 25. Adding the Price to the Order Summary

### 26. Adding a Toolbar

### 27. Using a Logo in our Application

### 28. Adding Reusable Navigation Items

### 29. Creating a Responsive Sidedrawer

### 30. Working on Responsive Adjustments

### 31. More about Responsive Adjustments

### 32. Reusing the Backdrop

### 33. Adding a Sidedrawer Toggle Button

### 34. Adding a Hamburger Icon

### 35. Improving the App - Introduction

### 36. Prop Type Validation

### 37. Improving Performance

### 38. Using Component Lifecycle Methods

### 39. Changing the Folder Structure

### 40. Wrap Up
