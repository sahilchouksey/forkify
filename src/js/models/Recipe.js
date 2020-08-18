import axios from 'axios';
import code from '../config'

export default class Search {
    constructor(id) {
        this.id = id;
    }

    async getRecipeInfo() {
        try {
        const res = await axios(`${code.proxy}https://api.spoonacular.com/recipes/informationBulk?ids=${this.id}&apiKey=${code.key}`); 
        const data = res.data[0];
        this.title = data.title;
        this.author = data.creditsText == null ? 'Unknown Publisher' : data.creditsText;
        this.img = data.image;
        this.url = data.sourceUrl;
        this.ingredients = data.extendedIngredients;
        this.orgIngredients = data.extendedIngredients;
        this.id = data.id;
        } catch (er) {
            console.log(er)
        }
    
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period*15;
    }

    calcServings() {
        this.servings = 4
    }

    returnIng() {
        const invalidSymbols = ["½", "⅓", "⅔", "¼", "¾", "⅕", "⅖", "⅗", "⅘", "⅙", "⅚", "⅐", "⅛", "⅜", "⅝", "⅞", "⅑", "⅒", "↉", "⅟"]; //½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅐ ⅛ ⅜ ⅝ ⅞ ⅑ ⅒ ↉ ⅟
        const orgNumbers = ["1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "5/6", "1/7", "1/8", "3/8", "5/8", "7/8", "1/9", "1/10", "0/3", "1/"];
        const ingredientsArray = this.ingredients.map(n => n['original']);
        const replaceSymbols = ingredientsArray.map(el => {
            invalidSymbols.forEach((symbol, cur) => {
                el = el.replace(symbol, ' ' + orgNumbers[cur]);
            })
            return el
        })
       this.ingredients = replaceSymbols
    }

    parseIngredients() {         
        const unitsLong = ["teaspoons", "tsps", "teaspoon", "tablespoons", "tablespoon", "ounces", "ounce", 
        "fluid ounces", "fluid ounce", "fluids", "fluid", "fl oz", "cups", "cup", "pints", "quarts",
        "gallons", "gals", "gal", "mls", "milliliters", "milliliter", "millilitres", "millilitre",
        "l", "liters", "liter", "litres", "litre", "dl", "deciliters", "deciliter", "decilitres", "decilitre", "pounds", 
        "lbs", "lb", "#", "mgs", "milligrams", "milligram", "milligrammes", "milligramme","g" , "grams", "gram",
        "grammes", "gramme", "kgs", "kilograms", "kilogram", "kilogrammes", "kilogramme"];

        const unitsShort = ['tsp', 'tsp', 'tsp', 'tbsp', 'tbsp', 'oz', 'oz', 'oz', 'oz',
        'oz', 'oz', 'oz', 'cup', 'cup', 'pint', 'quart', 'gallon', 'gallon', 'gallon', 'ml', 'ml', 'ml', 'ml', 'ml', 
        'litre', 'litre', 'litre', 'litre', 'litre', 'decilitre', 'decilitre', 'decilitre', 'decilitre', 'decilitre', 'pound', 'pound', 'pound', 'pound', 'mg', 'mg',
         'mg', 'mg', 'mg', 'gram' ,'gram', 'gram', 'gram', 'gram', 'kg',  
        'kg', 'kg', 'kg', 'kg']

        // .replace(/[^/]/g, "").length '–'  
        const ingredientsObj = this.orgIngredients;
        const newIngredients = this.ingredients.map((el,i) => {

            let ingredient = el.toLowerCase();
            // 0: Uniform units
            unitsLong.forEach((unit, i)=> {
               ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 1: Remove parentheses and fullstop
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            ingredient = ingredient.replace('.', '');

            
            // 2: Parse ingredient into count, unit and ingredient

            let arrIng = ingredient.split(' ');
            let unitIndex = arrIng.findIndex(unt => unitsShort.includes(unt));
            let countDef = Math.round(ingredientsObj[i]['measures']['us']['amount'] * 10) / 10;
            let unitDef = ingredientsObj[i]['measures']['us']['unitShort'] ;
            let obj;

            

            if (unitIndex > -1 && arrIng.includes('or')) {
            // console.log(`1`);
            let x = arrIng.slice(unitIndex+1).join(' ').replace(/[0-9]/g, '');
              x  = x.replace('-', '')
                 unitsShort.forEach((unit, i)=> {
                  x = x.replace(unit, '')
                 }); 
              x = x.split(' ')

              obj = {
                count:countDef ,
                unit: unitDef,
                ingredient: x.join(' ')
            }
            
            } else if (unitIndex > -1) {
                // console.log(`2`);
                let arrCount = arrIng.slice(0, unitIndex);


              let count = countDef 
              obj = {
                  count,
                  unit: unitDef,
                  ingredient: arrIng.slice(unitIndex+1).join(' ')
              }

            } else if (parseInt(arrIng[0], 10) && arrIng.includes('–')) {
                // console.log(`3`);

                const index = arrIng.findIndex(el => el.includes('–'));

                obj = {
                    count:countDef ,
                    unit:unitDef,
                    ingredient: arrIng.slice(index+2).join(' ')
                }
            } else if (parseInt(arrIng[0], 10) && arrIng.includes('to')) {
                // console.log(`4`);

                const index = arrIng.findIndex(el => el.includes('to'));
                // let newCount = arrIng.slice(index, index+2);
                // console.log(newCount)
                obj = {
                    count:countDef ,
                    unit:unitDef,
                    ingredient: arrIng.slice(index+2).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {

                // console.log(`5`);
                const arrIngSplit =  arrIng[0].split(/([0-9]+)/);

                if (parseInt(arrIngSplit[1], 10) && arrIngSplit[2] !== '') {
                    obj = {
                         count:countDef ,
                         unit:unitDef,
                         ingredient: ingredientsObj[i]['originalName'].replace(/ *\([^)]*\) */g, " ")
                     }
                } else 
                 
                obj = {
                    count:parseInt(arrIng[0], 10),
                    unit:'',
                    ingredient: ingredientsObj[i]['originalName'].replace(/ *\([^)]*\) */g, " ")
                }   
                


            } else {
                // console.log(`6`);

              obj = {
                  count:1,
                  unit:'',
                  ingredient
              }
            }
 

            return obj;
        }); 
        this.ingredients = newIngredients; 
    } 

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings)
        });

        this.servings = newServings
    }
} 