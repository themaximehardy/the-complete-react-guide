# Refreshing Next Generation JavaScript (Optional)

### 1. Understanding "let" and "const"

`var` = not block-scoped, could be dangerous to use it!

`let` = the new `var` which is now block-scoped, for variable values.

`const` = for constant values.

```js
var myName = 'Max';
console.log(name); // "Max"
myName = 'Manu';
console.log(name); // "Manu"
```

```js
let myName = 'Max';
console.log(name); // "Max"
myName = 'Manu';
console.log(name); // "Manu"
```

```js
const myName = 'Max';
console.log(name); // "Max"
myName = 'Manu';
console.log(name); // "TypeError: Assignment to constant variable"
```

### 2. Arrow Functions

No more issues with the **this** keyword!

```js
function myFunc() {
  ...
}

const myFunc = () => {
  ...
}
```

```js
const multiply = (number) => number * 2;

console.log(multiply(2)); // 4
```

### 3. Exports and Imports

```js
// person.js
const person = {
  name: 'Max',
};

export default person;
```

```js
// utility.js
export const clean = () => {...}
export const baseData = 10;
```

```js
// app.js
import person from './person';

import { baseData, clean } from './utility';
// OR you could assign an alias
import { clean as cleanFn } from './utility';
// OR you can import everything and assign an alias (or not)
import * as bundled from './utility';
```

### 4. Understanding Classes

JS classes are essentially blueprints for objects.

```js
class Person {
  name= 'Max' // property
  call = () => {...} // method
}
```

And the usage of the class above:

```js
const myPerson = new Person();
myPerson.call();
console.log(myPerson.name);
```

```js
// inheritance
class Person extends Master
```

Classes also support inheritance which means you have another class which you inherit from **taking all its properties and methods** and potentially adding new properties and methods.

---

```js
class Human {
  constructor() {
    this.gender = 'female';
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    super();
    this.name = 'Max';
    this.gender = 'male';
  }

  printMyName() {
    console.log(this.name);
  }
}

const person = new Person();
person.printMyName(); // Max
person.printGender(); // male
```

### 5. Classes, Properties and Methods

We've learned that **properties** are like "_variables_ attached to classes / objects" and **methods** are like "_functions_ attached to classes / objects".

```js
// properties
// ES6
constructor() {
  this.myProperty = 'value'
}

// ES7
myProperty = 'value'
```

```js
// methods
// ES6
myMethod() {...}

// ES7
myMethod = () => {...} // no problem wit the this keyword
```

Let's update our last example:

```js
class Human {
  gender = 'female';

  printGender = () => {
    console.log(this.gender);
  };
}

class Person extends Human {
  name = 'Max';
  gender = 'male';

  printMyName = () => {
    console.log(this.name);
  };
}

const person = new Person();
person.printMyName(); // Max
person.printGender(); // male
```

### 6. The Spread & Rest Operator

`...`

The **spread operator** = used to **split up array elements** OR **object properties**

```js
// example
const newArray = [...oldArray, 1, 2];
const newObject = { ...oldArray, newProp: 5 };
```

The **rest operator** = used to **merge a list of function arguments** into an array

```js
// example
function sortArgs(...args) {
  return args.sort();
}
```

---

```js
// spread operator
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];

console.log(newNumbers); // [1, 2, 3, 4];

// spread operator
const person = {
  name: 'Max',
};

const newPerson = {
  ...person,
  age: 28,
};

console.log(newPerson); // [object Object] { age: 28, name: "Max" }

// rest operator
const filter = (...args) => {
  return args.filter((el) => el === 1);
};

console.log(filter(1, 2, 3)); // [1]
```

### 7. Destructuring

Destructuring = easily extract array elements or object properties and store them in variables (≠ than the spread operator).

```js
// array destructuring
const [a, b] = ['Hello', 'Max'];
console.log(a); // Hello
console.log(b); // Max

// object destructuring
const { name } = { name: 'Max', age: 29 };
console.log(name); // Max
console.log(age); // undefined
```

---

```js
const numbers = [1, 2, 3];
[num1, , num3] = numbers;
console.log(num1, num3);
```

### 8. Reference and Primitive Types Refresher

```js
const number = 1; // primitive type
const num2 = number; // reference type (copy)

console.log(num2);
```

**Objects** and **Arrays** are reference types.

```js
// person is an object stored in memory and in the const person we store a pointer to that place in memory
const person = {
  name: 'Max',
};

// the pointer is copied in secondPerson
const secondPerson = person;

person.name = 'Manu';

console.log(secondPerson); // [object Object] { name: "Manu" }
```

To make a "**deep**" **copy**, we could do:

```js
const person = {
  name: 'Max',
};

const secondPerson = {
  ...person,
};

person.name = 'Manu';

console.log(secondPerson); // [object Object] { name: "Max" }
```

### 9. Refreshing Array Functions

```js
const number = [1, 2, 3];

const doubleNumArray = numbers.map((num) => {
  return num * 2;
});

console.log(numbers); // [1, 2, 3]
console.log(doubleNumArray); // [2, 4, 6]
```

- [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [`findIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- [`filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)
- [`concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat?v=b)
- [`slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
