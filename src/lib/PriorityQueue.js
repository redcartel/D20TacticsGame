export default class PriorityQueue{
    
    constructor(){
        this.values = [];
    }

    //helper method that swaps the values and two indexes of an array
    swap(index1, index2){
        let temp = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = temp;
        return this.values;
    }
    //helper methods that bubbles up values from end
    bubbleUp(){
        //get index of inserted element
        let index = this.values.length - 1
        //loop while index is not 0 or element no loger needs to bubble
        while(index > 0){
            //get parent index via formula
            let parentIndex = Math.floor((index - 1)/2);
            //if values is less than parent, swap the two
            if(this.values[parentIndex].priority > this.values[index].priority){
                //swap with helper method
                this.swap(index, parentIndex);
                //change current index to parent index
                index = parentIndex;
                // TODO: randomize ties
            } else{
                break;
            }
        }
        return 0;
    }
    // method that pushes new value onto the end and calls the bubble helper
    enqueue(priority, value){
        this.values.push({priority: priority, value: value});
        //calculate parent, if parent is greater swap
        //while loop or recurse
        this.bubbleUp();
        return this.values;
    }

    bubbleDown(index = 0) {
        let left = 2 * index + 1, right = 2 * index + 2;
        let least = index, heapLength = this.values.length - 1;
        if (left <= heapLength && this.values[left].priority < this.values[least].priority)
            least = left;
        if (right <= heapLength && this.values[right].priority < this.values[least].priority)
            least = right;
        if (least !== index) {
            [this.values[least], this.values[index]] = [this.values[index],this.values[least],];
            this.bubbleDown(least);
        }
    }

    get length() { return this.values.length; }

    dequeue(){
        //swap first and last element
        this.swap(0, this.values.length - 1);
        //pop max value off of values
        let poppedNode = this.values.pop();
        //re-adjust heap if length is greater than 1
        if(this.values.length > 1){
            this.bubbleDown();
        }
        
        return poppedNode.value;
    }
}