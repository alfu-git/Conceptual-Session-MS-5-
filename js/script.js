///// helping function /////
const getId = (id) => {
  return document.getElementById(id);
};

///// create loading function /////
const toggleLoading = (status) => {
  const loadingSec = getId('loading-sec');

  if(status) {
    loadingSec.classList.replace('hidden', 'flex');
  }
  else {
    loadingSec.classList.replace('flex', 'hidden');
  }
}

///// load all category btn & show all btn /////
// load
const loadCategoryBtn = async () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  const res = await fetch(url);
  const data = await res.json();
  showCategoryBtn(data.categories);
};
loadCategoryBtn();

// show
const showCategoryBtn = (allBtn) => {
  const categoryBtnContainer = getId("category-btn-container");
  categoryBtnContainer.innerHTML = "";

  allBtn.forEach((btn) => {
    const btnCard = document.createElement("button");
    btnCard.className =
      "btn bg-transparent border border-[black] shadow-sm w-full text-gray-600 font-medium";
    btnCard.innerText = `${btn.category_name}`;

    categoryBtnContainer.appendChild(btnCard);
  });
};

///// load all trees & show all trees /////
// load
const loadAllTrees = async () => {
  toggleLoading(true);

  const url = "https://openapi.programming-hero.com/api/plants";
  const res = await fetch(url);
  const data = await res.json();
  showAllTrees(data.plants);

  toggleLoading(false);
};
loadAllTrees();

// show
const showAllTrees = (trees) => {
  const allTreesContainer = getId("all-trees-container");
  allTreesContainer.innerHTML = "";

  trees.forEach((tree) => {
    const treeCard = document.createElement("div");
    treeCard.className = "card bg-base-100 shadow-sm";
    treeCard.innerHTML = `
    <figure>
      <img
        class="h-40 w-full object-cover"
        src="${tree.image}"
        alt="${tree.name}"
        title="${tree.name}"
      />
    </figure>
    <div class="card-body p-3">
      <h3 class="tree-name text-xl font-semibold max-w-fit hover:text-[#4ADD7F] cursor-pointer">${tree.name}</h3>
      <p class="line-clamp-2 text-sm opacity-80">
        ${tree.description}
      </p>
      <span class="category inline-block max-w-fit py-1 px-3 border border-[#4ADD7F] rounded-lg text-[#4ADD7F]">${tree.category}</span>
      <div class="flex items-center justify-between">
        <span class="price text-[#4ADD7F] text-xl font-semibold">$${tree.price}</span>
        <button class="cart-btn btn py-2 px-4 bg-[#4ADD7F] rounded-lg text-base-100">Cart</button>
      </div>
    </div>
    `;

    allTreesContainer.appendChild(treeCard);
  });
};
