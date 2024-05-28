"use strict";

// modal variables
const modal = document.querySelector("[data-modal]");
const modalCloseBtn = document.querySelector("[data-modal-close]");
const modalCloseOverlay = document.querySelector("[data-modal-overlay]");

// modal function
const modalCloseFunc = function () {
  modal.classList.add("closed");
};

// modal eventListener
modalCloseOverlay.addEventListener("click", modalCloseFunc);
modalCloseBtn.addEventListener("click", modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector("[data-toast]");
const toastCloseBtn = document.querySelector("[data-toast-close]");

// notification toast eventListener
toastCloseBtn.addEventListener("click", function () {
  notificationToast.classList.add("closed");
});

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll(
  "[data-mobile-menu-open-btn]"
);
const mobileMenu = document.querySelectorAll("[data-mobile-menu]");
const mobileMenuCloseBtn = document.querySelectorAll(
  "[data-mobile-menu-close-btn]"
);
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove("active");
    overlay.classList.remove("active");
  };

  mobileMenuOpenBtn[i].addEventListener("click", function () {
    mobileMenu[i].classList.add("active");
    overlay.classList.add("active");
  });

  mobileMenuCloseBtn[i].addEventListener("click", mobileMenuCloseFunc);
  overlay.addEventListener("click", mobileMenuCloseFunc);
}

// accordion variables
const accordionBtn = document.querySelectorAll("[data-accordion-btn]");
const accordion = document.querySelectorAll("[data-accordion]");

for (let i = 0; i < accordionBtn.length; i++) {
  accordionBtn[i].addEventListener("click", function () {
    const clickedBtn = this.nextElementSibling.classList.contains("active");

    for (let i = 0; i < accordion.length; i++) {
      if (clickedBtn) break;

      if (accordion[i].classList.contains("active")) {
        accordion[i].classList.remove("active");
        accordionBtn[i].classList.remove("active");
      }
    }

    this.nextElementSibling.classList.toggle("active");
    this.classList.toggle("active");
  });
}

// Get the modal
var modalWish = document.getElementById("Wishlist-Mdales");
var btn = document.getElementById("whishlistBtn");
var span = document.getElementsByClassName("closeWhishlist")[0];
btn.onclick = function () {
  modalWish.style.display = "block";
};
span.onclick = function () {
  modalWish.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modalWish) {
    modalWish.style.display = "none";
  }
};






// Get the modal
var modalWish = document.getElementById("Wishlist-Mdales");
var btn = document.getElementById("whishlistBtn");
var span = document.getElementsByClassName("closeWhishlist")[0];
btn.onclick = function () {
  modalWish.style.display = "block";
};
span.onclick = function () {
  modalWish.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modalWish) {
    modalWish.style.display = "none";
  }
};

let listing = null;
fetch("/assets/js/listings.json")
  .then((Response) => Response.json())
  .then((data) => {
    listing = data;
    console.log(listing);
    addDataToHTML();
  });
// adding data listing to html probeblu its hard
let listingProduct = document.querySelector(".product-grid");
function addDataToHTML() {
  listing.forEach((listing) => {
    // create new Element items
    let newListings = document.createElement("a");
    newListings.href = "./assets/pages/listings.html?id=" + listing.id;
    newListings.dataset.id = listing.id;
    newListings.classList.add("showcase");
    newListings.innerHTML = `
        
              <div class="showcase-banner">
            <img
              src="${listing.image}"
              alt="Mens Winter Leathers Jackets"
              width="300"
              class="product-img default"
            />
            <img
              src="${listing.image2hover}"
              alt="Mens Winter Leathers Jackets"
              width="300"
              class="product-img hover"
            />

            <p class="showcase-badge">${listing.badg}</p>

            <div class="showcase-actions">
              <button class="btn-action">

                  <ion-icon name="heart-outline" class="btn-actionT"></ion-icon>
                </a>
              </button>

              <button class="btn-action">
                <ion-icon name="eye-outline"></ion-icon>
              </button>
            </div>
          </div>

        <div class="showcase-content">
          <a href="#" class="showcase-category">${listing.gategory}</a>
          <a href="#">
          <h3 class="showcase-title">${listing.name}</h3>

          </a>
          <div class="showcase-rating">
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          </div>

          <div class="price-box">
        <p class="price">$${listing.price}</p>
        <del>$${listing.deel}</del>
        </div>
        </div>
        `;
    listingProduct.appendChild(newListings);
  });
}


// Add listing to wishlist

let products = [];
let cart = [];
listingProduct.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-actionT')) {
    event.preventDefault();
    event.stopPropagation();
    let anchorElement = event.target.closest('.showcase');
    if (anchorElement) {
      let id_product = anchorElement.dataset.id;
      // alert(id_product);
      addTowidhList(id_product);
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let listingProduct = document.querySelector(".product-grid");
  let listing;  // This holds your JSON data

  // Fetch your listings JSON data
  fetch("/assets/js/listings.json")
    .then(response => response.json())
    .then(data => {
      listing = data;
      // Load wishlist items from localStorage on initial load
      loadWishlistItems();
    });

  listingProduct.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-actionT')) {
      event.preventDefault();
      event.stopPropagation();

      let anchorElement = event.target.closest('.showcase');
      if (anchorElement) {
        let id_product = anchorElement.dataset.id;
        updateWishlistModal(id_product);
        showToast("Item added to wishlist!");
      }
    }
  });

  function updateWishlistModal(id) {
    const listingItem = listing.find(item => item.id.toString() === id);
    if (!listingItem) {
      console.error("Listing not found for ID:", id);
      return;
    }

    const now = new Date();
    const dateString = now.toISOString().split('T')[0];

    const entry = {
      id: listingItem.id,
      image: listingItem.image,
      name: listingItem.name,
      dateAdded: dateString
    };

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.push(entry);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    addWishlistItemToDOM(entry);
    updateWishlistCount();
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  function addWishlistItemToDOM(entry) {
    const entryHTML = `
        <div class="sub-cardItem" data-id="${entry.id}">
          <ion-icon name="close-circle-outline" class="removeFromWishlist"></ion-icon>
          <img src="${entry.image}" alt="">
          <div id="toolTrip-text">
            <p class="wishlist-listing-name">${entry.name}</p>
            <p class="datetime">added on: ${entry.dateAdded}</p>
          </div>
        </div>
      `;

    const modalContent = document.querySelector('.whislist-card');
    modalContent.innerHTML += entryHTML;
  }

  function loadWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.forEach(item => addWishlistItemToDOM(item));
    updateWishlistCount();  // Update count when items are loaded
  }

  function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = wishlist.length;
    const countSpan = document.querySelector('#whishlistBtn .count');
    countSpan.textContent = count;
  }

  document.querySelector('.closeWhishlist').addEventListener('click', function () {
    document.getElementById('Wishlist-Mdales').style.display = 'none';
  });

  // Add event listener for removing items from wishlist
  document.querySelector('.whislist-card').addEventListener('click', function (event) {
    if (event.target.classList.contains('removeFromWishlist')) {
      const subCardItem = event.target.closest('.sub-cardItem');
      if (subCardItem) {
        const id = subCardItem.dataset.id;
        removeFromWishlist(id);
        subCardItem.remove();
        updateWishlistCount();
      }
    }
  });

  function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id.toString() !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
});



// google Oauthentification with google and github
// const form = document.querySelector("form"),
//         nextBtn = form.querySelector(".nextBtn"),
//         backBtn = form.querySelector(".backBtn"),
//         allInput = form.querySelectorAll(".first input");


// nextBtn.addEventListener("click", ()=> {
//     allInput.forEach(input => {
//         if(input.value != ""){
//             form.classList.add('secActive');
//         }else{
//             form.classList.remove('secActive');
//         }
//     })
// })

// backBtn.addEventListener("click", () => form.classList.remove('secActive'));
const form = document.querySelector("form"),
              nextBtn = form.querySelector(".nextBtn"),
              allInput = form.querySelectorAll(".first input");
    
        nextBtn.addEventListener("click", () => {
            let allFilled = true;
            allInput.forEach((input) => {
                if (input.value === "") {
                    allFilled = false;
                }
            });
    
            if (allFilled) {
                window.location.href = '/assets/pages/loginPage.html'; 
            } else {
                alert("Please fill out all fields.");
            }
        });


        function togglePasswordVisibility(fieldId, icon) {
            const field = document.getElementById(fieldId);
            const fieldType = field.getAttribute('type');
            if (fieldType === 'password') {
                field.setAttribute('type', 'text');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                field.setAttribute('type', 'password');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function checkPasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const passwordMatchMessage = document.getElementById('passwordMatch');

            if (password === confirmPassword) {
                passwordMatchMessage.textContent = '';
                passwordMatchMessage.style.color = '';
            } else {
                passwordMatchMessage.textContent = 'Passwords do not match';
                passwordMatchMessage.style.color = 'red';
            }
        }
    