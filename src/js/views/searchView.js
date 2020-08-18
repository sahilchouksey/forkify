import { elements } from './base';
import { query } from '../index';


export const getInput = () => elements.searchInput.value; 

export const clearInput = () => {
   elements.searchInput.value = ''; 
} ;

export const clearResult = () => {
   elements.searchResultList.innerHTML = '';
   elements.searchResPage.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active')
    });
    if (document.querySelector(`.results__link[href*="#${id}"]`) === null) {
    } else {
        document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
    }
};
/*
exp:
title:
'pizza with tomato and sauce'.split(' ')
['pizza', 'with', 'tomato', 'and', 'sauce'].reduce(pre, cur) if (pre + cur.length <= 17)
pre : 0 / pre + cur.length - 5 = 5 (5 <= 17 => true) / newTitle = ['pizza' ] 
pre : 5 / pre + cur.length - 4 = 9 (9 <= 17 => true) / newTitle = ['pizza', 'with'] 
pre : 9 / pre + cur.length - 9 = 15 (15 <= 17 => true) / newTitle = ['pizza', 'with', 'tomato'] 
pre : 15 / pre + cur.length - 3 = 18 (5 <= 17 => false) / newTitle = ['pizza', 'with', 'tomato']
pre : 18 / pre + cur.length - 5 = 23 (23 <= 17 => false) / newTitle = ['pizza', 'with', 'tomato']

*/

export const limitRecipeTitle = (title, limit = 17) => {
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

const renderRecipe = recipe => {
 const markUp = `<li>
                    <a class="results__link" href="#${recipe.id}" data-re="${recipe.id}">
                        <figure class="results__fig">
                            <img src="${recipe.image}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        </div>
                    </a>
                </li> `

 elements.searchResultList.insertAdjacentHTML('beforeend', markUp);
};


const createButton = (page, type) => `
     <button class="btn-inline results__btn--${type}" data-goTo="${type === 'next' ? page + 1 : page - 1}">
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
      </button>
`

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage)

  let button;
  if (page ===  1 && pages > 1) {
    // only btn to go to next page
    button = createButton(page, 'next')
  } else if (page < pages) {
   // both btns
   button = `
        ${button = createButton(page, 'prev')}
        ${button = createButton(page, 'next')}          
   `
  } else if (page === pages && pages > 1) {
    // only btn to go to next page
    button = createButton(page, 'prev')
  }

 
  const invalidRecipe = `
  <h2>0 recipe results for "${query}"</h2>
  `

  elements.searchResPage.insertAdjacentHTML('afterbegin', button === undefined ? invalidRecipe : button)  


};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    // render result of cur pg
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end /* not included exp end = 10 it will run until it reaches 9*/).forEach(renderRecipe) // i => renderRecipe(i)
   
    // render pagination buttons 
    renderButtons(page, recipes.length, resPerPage)
};