import { elements } from './base';

export const addItem = item => {
    const markUp = `
        <li class="shopping__item" data-itemID="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p> 
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
            </button>
        </li>
    ` 
    
    elements.shoppingList.insertAdjacentHTML('beforeend', markUp)
} 

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemID="${id}"]`);
    if (item) item.parentElement.removeChild(item)
} 

export const deleteAllItems = () => {
    elements.shoppingList.innerHTML = ''
}

export const deleteAllBtn = numlist => {
    elements.deleteAll.style.visibility = numlist > 0 ? 'visible' : 'hidden' ;
}