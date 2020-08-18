export const elements = {
    searchForm: document.querySelector('.search'),
    randomBtn: document.querySelector('.random__btn'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likeMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    deleteAll: document.querySelector('.deleteAll__btn')
};

const elStr = {
    loader : 'loader'
};

export const renderLoader = parent => {
    const loader = `
       <div class="${elStr.loader}">
           <svg>
              <use href='img/icons.svg#icon-cw'></use>
           </svg>
       </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader)
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elStr.loader}`);
    if (loader) loader.parentNode.removeChild(loader)
}