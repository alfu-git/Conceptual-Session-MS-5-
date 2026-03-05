///// helping function /////
const getId = (id) => {
  return document.getElementById(id);
}

///// load all category btn & show those /////
// load 
const loadCategoryBtn = async () => {
  const url = 'https://openapi.programming-hero.com/api/categories';
  const res = await fetch(url);
  const data = await res.json();
  showCategoryBtn(data.categories);
}
loadCategoryBtn();

// show
const showCategoryBtn = (allBtn) => {
  const categoryBtnContainer = getId('category-btn-container');
  categoryBtnContainer.innerHTML = '';

  allBtn.forEach(btn => {

    const btnCard = document.createElement('button');
    btnCard.className = "btn bg-transparent border border-[black] shadow-sm w-full text-gray-600 font-medium";
    btnCard.innerText = `${btn.category_name}`;

    categoryBtnContainer.appendChild(btnCard);
  })
}