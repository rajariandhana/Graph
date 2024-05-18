class Queue {
    constructor() {
      this.items = [];
    }
  
    // Add an element to the end of the queue
    enqueue(element) {
      this.items.push(element);
    }
  
    // Remove and return the element from the front of the queue
    dequeue() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items.shift();
    }
  
    // Return the front element of the queue without removing it
    front() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items[0];
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Return the number of elements in the queue
    size() {
      return this.items.length;
    }
  
    // Print all elements in the queue
    print() {
      console.log(this.items.toString());
    }
    contents()
    {
      return this.items.toString();
    }
  }
  
  // Example usage
//   const queue = new Queue();
  
//   queue.enqueue(1);
//   queue.enqueue(2);
//   queue.enqueue(3);
  
//   console.log(queue.front()); // Output: 1
//   console.log(queue.dequeue()); // Output: 1
//   console.log(queue.front()); // Output: 2
//   console.log(queue.size()); // Output: 2
//   queue.print(); // Output: 2,3
  