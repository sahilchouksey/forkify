import axios from 'axios';
import code from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
        const data = await axios(`${code.proxy}https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&apiKey=${code.key}&number=100`);
        this.result = data.data.results; 
        //console.log(this.result)
        } catch (er) {
            console.log(er)
        }
    
    }
} 


 