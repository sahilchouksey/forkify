import Search from './models/Search';
import Random from './models/Random';
import Recipe from './models/Recipe';
import List from './models/List';
import SimilarRecipes from './models/SimilarRecipes';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as similarRecipeView from './views/similarRecipeView';
import * as likesView from './views/likesView';



/** 
** Global state of the app **
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
**/

const state = {};

/********************
  SEARCH CONTROLLER
********************/
export let query;
export const controlSearch = async () => {
    // 1: Get query from view
    query = searchView.getInput();

  if (query) {
          // 2: New search object and add to state
    state.search = new Search(query);
    
    // 3: Prepare UI for search results
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    try {
    // 4: Search for recipes
    await state.search.getResults();
 
    // 5: Render results on UI  
    clearLoader();
    searchView.renderResult(state.search.result)
    } catch (er) {
      alert(`Something wrong with the search...`)
      clearLoader();
    }
  }                                                
}

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch()
})


elements.searchResPage.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResult();
      searchView.renderResult(state.search.result, goToPage);
  }
});


/********************
  RECIPE CONTROLLER
********************/
const recipeController = async () => {
  // Get ID from url
 const id = window.location.hash.replace('#', ''); // coz this is basically a str so we can use str methods here
 if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    // Create new recipe obj
    state.recipe = new Recipe(id);

    // highlight selected recipe
    if (state.search) searchView.highlightSelected(state.recipe.id);

    try {
   // Get recipe data
    await state.recipe.getRecipeInfo();
    state.recipe.returnIng();
    state.recipe.parseIngredients();

    // Calculate servings & time
    state.recipe.calcTime()
    state.recipe.calcServings()

    // Render result
    clearLoader();
    recipeView.renderRecipe(
      state.recipe,
      state.likes.isLiked(state.recipe.id)
      )
    } catch(er) {
      alert('Error procesing recipe!')
      clearLoader();
    }

 }
}


// window.addEventListener('hashchange', recipeController)
// window.addEventListener('load', recipeController)
['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController))



/********************
  LIKES CONTROLLER
********************/

const likesController = () => {
  // Create a likes menu IF there is none yet
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id

  // user has NOT YET liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.img,
      state.recipe.author
    )

    // toggle the like button
    likesView.toggleLikeBtn(true)


    // add like to UI list
    likesView.renderLike(newLike)

  // user HAS liked current recipe
  } else {
    // delete like from the state
    state.likes.deleteLike(currentID)

    // toggle the like button
    likesView.toggleLikeBtn(false)

    // delete like from UI list
    likesView.deleteLike(currentID)

  }
  likesView.toggleLikeMenuBtn(state.likes.getNumLikes())
}

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenuBtn(state.likes.getNumLikes());
  
  // Render the exiting recipes
  state.likes.likes.forEach(like => likesView.renderLike(like))
})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
    // DECREASE button is clicked
    state.recipe.updateServings('dec');
    recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // INCREASE button is clicked
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    listController();
  } else if (e.target.matches('.similar__btn--add, .similar__btn--add *')) {
    SimilarRecipesController(state.recipe.id, state.recipe.img);
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    likesController();
  }
  
})



/********************
RANDOM RECIPES CONTROLLER
********************/

const randomRecipeController = async () => {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    // Create new recipe obj
    state.randomRecipe = new Random();

    try {

    // Get recipe data
    await state.randomRecipe.getResults()
 
    window.location.hash = state.randomRecipe.id                                                                                                                                                                                                                                                         ;

    state.randomRecipe.returnIng();
    state.randomRecipe.parseIngredients();

    // Calculate servings & time
    state.randomRecipe.calcTime()
    state.randomRecipe.calcServings()

    // Render result
    clearLoader();
    recipeView.renderRecipe(state.randomRecipe)  
  } catch(er) {
    alert('Error procesing recipe!')
    clearLoader();

  }
 }

 // RANDOM BUTTON
elements.randomBtn.addEventListener('click', e=> {
  e.preventDefault();
  randomRecipeController()
})



/********************
SIMILAR RECIPES CONTROLLER
********************/

const SimilarRecipesController = async(id, img) => {
  if (id) {
    //  New search object and add to state
    state.similarRecipes = new SimilarRecipes(id, img);

    //  Prepare UI for search results
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    
    try {
    await state.similarRecipes.getResults();
    
    //  Render results on UI  
    clearLoader();
    similarRecipeView.renderResult(state.similarRecipes)
    } catch (er) {
    alert(`Something went wrong...`)
    clearLoader();
    }
  }   
}



/********************
  LIST CONTROLLER
********************/
const listController = () => {
  // Create a list IF there is none yet
  if(!state.list) state.list = new List();

  // Adding ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
    let item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.addItem(item);
  });

  listView.deleteAllBtn(state.list.getNumList())

};

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {

  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id);
    
    // delete from UI
    listView.deleteItem(id)

    // handle the count button
  } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {
    // getting value from the UI
    const val = parseFloat(e.target.value, 10);

    // update count in the state
    state.list.updateCount(id, val)
  }



})

// delete all items btn
elements.deleteAll.addEventListener('click', () => {
  state.list.deleteAllItem();
  listView.deleteAllItems();
  listView.deleteAllBtn(state.list.getNumList())

})

// Restore shopping list on page load
window.addEventListener('load', () => {
  state.list = new List()

  // Restore likes
  state.list.readStorage();

  // display dlt all btn
  listView.deleteAllBtn(state.list.getNumList())
  
  // Render the exiting recipes
  state.list.items.forEach(item => listView.addItem(item))
})

