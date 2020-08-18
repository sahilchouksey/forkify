import axios from 'axios';
import code from '../config'

export default class SimilarRecipes {
    constructor (id, image) {
        this.id = id
        this.image = image
    };

    async getResults() {
        try {
        const data = await axios(`${code.proxy}https://api.spoonacular.com/recipes/${this.id}/similar?apiKey=${code.key}&number=5`);
        this.result = data.data; 
        } catch (er) {
            console.log(er)
        }
    
    }
}

