import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = []
    }

    addItem (count, unit, ingredient) {
    const item = {    
        id: uniqid(),
        count,
        unit,
        ingredient
    }
    this.items.push(item);
           
    // persist data in LOCALSTORAGE
    this.persistData();

    return item
   }

   deleteItem (id) {
       const index = this.items.findIndex(el => el.id === id);
       // Diffrence between splice & slice
       // [3,6,8,1].splice(2(start), 1(numbers you want to remv)) -> return [8] org arr --> [3,6,1]
       // [3,6,8,1].slice(1(start), 2(not incld)) -> return [6] --> org arr --> [3,6,8,1]
       this.items.splice(index, 1);

              
       // persist data in LOCALSTORAGE
       this.persistData();
   }

   deleteAllItem() {
     this.items = [];

      // persist data in LOCALSTORAGE
      this.persistData();
   }

   updateCount(id, newCount) {
      console.log(this.items);
      if (this.items) this.items.find(el => el.id === id).count = newCount
   }

   getNumList() {
       return this.items.length
   }

   persistData() {
    localStorage.setItem('list', JSON.stringify(this.items))
  }
  
  readStorage() {
    const storage = JSON.parse(localStorage.getItem('list'));

    // restoring Likes from the localStorage
    if (storage) this.items = storage
  }
}