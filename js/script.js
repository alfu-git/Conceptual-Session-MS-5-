///// helping function /////
const getId = (id) => {
  return document.getElementById(id);
};

///// loading function /////
const toggleLoading = (status) => {
  const loadingSec = getId("loading-sec");

  if (status) {
    loadingSec.classList.replace("hidden", "flex");
  } else {
    loadingSec.classList.replace("flex", "hidden");
  }
};

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
    btnCard.className = "category-btn inactive btn w-full font-medium";
    btnCard.innerText = `${btn.category_name}`;
    categoryBtnContainer.appendChild(btnCard);

    activeBtn(btnCard, btn.id);
  });
};

///// active button & filter tree function /////
const activeBtn = (clickedBtn, btnId) => {
  clickedBtn.addEventListener("click", async () => {
    // active btn
    const allCategoryBtns = document.querySelectorAll(
      "#default-active, .category-btn",
    );

    allCategoryBtns.forEach((categoryBtn) => {
      categoryBtn.classList.remove("active");
      categoryBtn.classList.add("inactive");
    });
    clickedBtn.classList.remove("inactive");
    clickedBtn.classList.add("active");

    // filter tree function
    toggleLoading(true);

    const url = `https://openapi.programming-hero.com/api/category/${btnId}`;
    const res = await fetch(url);
    const data = await res.json();
    showAllTrees(data.plants);

    toggleLoading(false);
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
    if (tree.price > 500) {
      treeCard.className =
        "card bg-base-100 border-b-3 border-red-500 shadow-sm";
    } else {
      treeCard.className =
        "card bg-base-100 border-b-3 border-[#4ADD7F] shadow-sm";
    }
    treeCard.innerHTML = `
    <figure>
      <img
        onclick="openTreeModal(${tree.id})"
        class="h-40 w-full object-cover cursor-pointer"
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
        <span class="price ${tree.price > 500 ? "text-red-600" : "text-[#4ADD7F]"} text-xl font-semibold">$${tree.price}</span>
        <button onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})" class="cart-btn btn py-2 px-4 bg-[#4ADD7F] rounded-lg text-base-100">Cart</button>
      </div>
    </div>
    `;

    allTreesContainer.appendChild(treeCard);
  });
};

///// active all trees btn /////
const allTreesBtn = getId("default-active");
allTreesBtn.addEventListener("click", () => {
  const allCategoryBtns = document.querySelectorAll(
    "#default-active, .category-btn",
  );

  allCategoryBtns.forEach((categoryBtn) => {
    categoryBtn.classList.remove("active");
    categoryBtn.classList.add("inactive");
  });
  allTreesBtn.classList.remove("inactive");
  allTreesBtn.classList.add("active");

  loadAllTrees();
});

///// set modal /////
const treeModal = getId("tree-modal");

const openTreeModal = async (treeId) => {
  const url = `https://openapi.programming-hero.com/api/plant/${treeId}`;
  const res = await fetch(url);
  const data = await res.json();
  const modalDetails = data.plants;

  const treeModalContainer = getId("tree-modal-container");
  treeModalContainer.innerHTML = "";

  const modalCard = document.createElement("div");
  modalCard.innerHTML = `
    <h3 class="mb-3 text-xl font-semibold max-w-fit hover:text-[#4ADD7F] cursor-pointer">${modalDetails.name}</h3>
    <figure class="mb-7">
      <img
        class="h-60 w-full object-cover  rounded-xl"
        src="${modalDetails.image}"
        alt="${modalDetails.name}"
        title="${modalDetails.name}"
      />
    </figure>
    <span class="block mb-3 text-gray-600 font-medium"> Category:
      <span class="inline-block max-w-fit py-1 px-3 border border-[#4ADD7F] rounded-lg text-[#4ADD7F]">
        ${modalDetails.category}
      </span>
    </span>
    <p class="mb-3 text-sm opacity-80">${modalDetails.description}</p>
    <span class="text-[#4ADD7F] text-3xl font-semibold">$${modalDetails.price}</span>
  `;
  treeModalContainer.appendChild(modalCard);

  treeModal.showModal();
};

///// cart function /////
let allCartItems = [];

// set cart icon count & text color
const setCartIconCount = () => {
  const cartIconCount = getId("cart-icon-count");

  // add count color
  cartIconCount.classList.remove("text-red-600", "text-[#4ADD7F]");

  if (allCartItems.length === 0) {
    cartIconCount.classList.add("text-red-600");
  } else {
    cartIconCount.classList.add("text-[#4ADD7F]");
  }

  cartIconCount.innerText = allCartItems.length;
};
setCartIconCount();

const addToCart = (treeId, treeName, treePrice) => {
  const existingItem = allCartItems.find((item) => item.treeName === treeName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    allCartItems.push({
      treeId,
      treeName,
      treePrice,
      quantity: 1,
    });
  }

  showCartList();
};

const showCartList = () => {
  const cartContainer = getId("cart-container");
  cartContainer.innerHTML = "";

  if (allCartItems.length === 0) {
    getId('empty-text-content').classList.remove('hidden');
    getId('total-amount').textContent = '0';
  }
  else {
    getId('empty-text-content').classList.add('hidden');
  }

  let total = 0;
  allCartItems.forEach((item) => {
    total += item.treePrice * item.quantity;
    const listCard = document.createElement("div");
    listCard.className = "p-3 bg-[#EEEEEE] rounded-md shadow-sm";
    listCard.innerHTML = `
      <div class="flex justify-between">
        <div>
          <h4 class="text-xl font-bold">${item.treeName}</h4>
          <span>${item.treePrice} X ${item.quantity}</span>
        </div>
        <span onclick="removeList(${item.treeId})" class="text-sm text-red-600 opacity-80 cursor-pointer">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>

      <span class="block text-right">$${item.treePrice * item.quantity}</span>
    `;
    cartContainer.appendChild(listCard);
    setCartIconCount();
  });

  const totalAmount = getId("total-amount");
  totalAmount.innerText = total;
};

// remove list from cart list
const removeList = (id) => {
  const updateCartItems = allCartItems.filter((item) => item.treeId !== id);
  allCartItems = updateCartItems;
  showCartList();
  setCartIconCount();
};
