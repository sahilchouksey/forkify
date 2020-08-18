import { elements } from './base';


const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
     title.split(' ').reduce((acc, cur) => {
         const T = acc + cur.length;
         if( T <= limit) {
            newTitle.push(cur)
         }
         return T;
     }, 0)
     return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderRecipe = (recipe, img) => {
 const markUp = `<li>
                    <a class="results__link" href="#${recipe.id}" data-re="${recipe.id}">
                        <figure class="results__fig">
                            <img src="${img}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        </div>
                    </a>
                </li> `

 elements.searchResultList.insertAdjacentHTML('beforeend', markUp);
};



export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    // render result of cur pg
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.result.slice(start, end /* not included exp end = 10 it will run until it reaches 9*/).forEach(i => renderRecipe(i, recipes.image));
};