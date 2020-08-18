export default class Likes {
    constructor() {
        this.likes = []
    }

    addLike(id, title, img, author) {
       const newLike = {
           id,
           title, 
           img,
           author
       }
       this.likes.push(newLike);
       
       // persist data in LOCALSTORAGE
       this.persistData();

       return newLike;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // persist data in LOCALSTORAGE
        this.persistData()
    }

    isLiked(id) {       
       return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restoring Likes from the localStorage
        if (storage) this.likes = storage
    }
}