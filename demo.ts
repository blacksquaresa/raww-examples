"use strict";
import { RunAsWebWorker } from "run-as-web-worker";

// Create some global objects to use for dependencies
const func1 = () => {
  console.log("Function 1");
};
const func2 = function() {
  console.log("Function 2");
};
function func3() {
  console.log("Function 3");
}

// This object contains references to functions, two levels deep
const myObj = {
  boo: true,
  name: "my name",
  num: 42,
  arr: [45, 60],
  func: func3,
  utils: {
    func1, func2, func3
  }
};

// This array references our deep object again - and all the functions again
const deep: any[] = [ myObj, func2 ];

// Create a class to perform our demo functions
// this class has three simple methods: add to add two numbers, sub to subtract and error to throw an error
class Adder {
  constructor() {
    RunAsWebWorker()(this, "sub", {});
  }

  // Use the decorator to hoist this function. We're adding all our dependencies here
  @RunAsWebWorker(
    { myString: "myString", myNumber: 42, myBool: true },
    { func1, func2, func3, myObj },
    { deep }
  )
  add(x: number, y: number) {
    return new Promise((resolve, reject) => {
      myObj.func();
      myObj.utils.func2();
      deep[0].utils.func3();
      const result = x + y;
      resolve(result);
    });
  }

  // This function does not use the decorator, but is hoisted manually in the constructor
  sub = (x: number, y: number, z: number) => {
    return new Promise((resolve, reject) => {
      resolve(Number(x) - Number(y) - z);
    });
  };

  // This method demonstrates what happens when an error occurs in your hoisted function
  @RunAsWebWorker()
  error(message: string) {
    return new Promise((resolve, reject) => {
      reject(message);
    });
  }
}

// This code creates references to the DOM elements we'll use later 
let num1: HTMLInputElement =
  (document.getElementById("num1") as HTMLInputElement) ||
  new HTMLInputElement();
let num2: HTMLInputElement =
  (document.getElementById("num2") as HTMLInputElement) ||
  new HTMLInputElement();
let equals: HTMLElement =
  document.getElementById("equals") || new HTMLElement();
let answer: HTMLElement =
  document.getElementById("answer") || new HTMLElement();
let answer2: HTMLElement =
  document.getElementById("answer2") || new HTMLElement();

// Now create a new instance of the Adder class, which we'll also use later
const adder = new Adder();

// Add an event listerner to the button click event. When the button clicks, we'll do everything...
// specifically, we'll call each of the three class methods, then call one of the methods deep in our dependencies, just to check they're still there.
equals.addEventListener(
  "click",
  () => {
    const number1 = Number(num1.value);
    const number2 = Number(num2.value);
    adder.add(number1, number2).then(result => {
      answer.innerText = `${number1} plus ${number2} equals ${result}`;
    });

    adder.sub(number1, number2, 2).then(result => {
      answer2.innerText = `${number1} minus ${number2} minus 2 equals ${result}`;
    });

    adder.error("testing an error").catch((reason: string) => {
      console.log(reason);
    });

    // Ensure we can still call the objects in our main file
    deep[0].utils.func1();
  },
  false
);
