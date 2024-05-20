class Stack {
  constructor() {
    this.items = [];
  }

  // Add an element to the top of the stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return the element from the top of the stack
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  // Return the top element of the stack without removing it
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the number of elements in the stack
  size() {
    return this.items.length;
  }

  // Print all elements in the stack
  print() {
    console.log(this.items.toString());
  }

  // Return the stack's contents as a string
  contents() {
    let c = [...new Set(this.items)];
    return c.toString();
  }
  inStack(target) {
    return this.items.includes(target);
  }
}

// Example usage
// const stack = new Stack();

// stack.push(1);
// stack.push(2);
// stack.push(3);

// console.log(stack.peek()); // Output: 3
// console.log(stack.pop()); // Output: 3
// console.log(stack.peek()); // Output: 2
// console.log(stack.size()); // Output: 2
// stack.print(); // Output: 1,2
// console.log(stack.contents()); // Output: 1,2
