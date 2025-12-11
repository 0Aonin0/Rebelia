for (let el of document.getElementsByClassName("pizza-price")){
    el.style.color = "red"
};

for (let el of document.getElementsByClassName("add-pizza")) el.addEventListener('click',()=>{
    
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('msg-added')) {
                return;
            }

            const message = document.createElement('div');
            message.innerText = 'Додано у кошик!';
            message.classList.add('msg-added');
            el.insertAdjacentElement('afterend', message);

            setTimeout(() => {
                message.style.opacity = '0'; 
                
                setTimeout(() => {
                    message.remove();
                }, 500); 
            }, 2000);
 });

document.addEventListener('keydown', function(event) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const textElements = document.querySelectorAll('.contacts-main p, .contacts-main li, .contacts-main span, .contacts-main b, .contacts-main a, .contacts-main h1');
    const step = 1;
    textElements.forEach(element => {
        let currentSize = parseFloat(window.getComputedStyle(element).fontSize);
        if (event.key === 'ArrowUp') {
            element.style.fontSize = (currentSize + step) + 'px';
        } 
        else if (event.key === 'ArrowDown') {
            if (currentSize > 8) {
                element.style.fontSize = (currentSize - step) + 'px';
            }
        }
    });
});

function addPizzaToBasket(arr) {
    const [id, name, desc, price, image] = arr;
    const container = document.querySelector('.basket_container');
    const item = document.createElement('div');
    item.classList.add('basket-item');

    item.innerHTML = `
        <img src="${image}" alt="${name}" class="basket-image">
        <div class="basket-details">
            <span>${name}</span>
            <p>${desc}</p>
        </div>
        <span class="basket-item-price">Ціна: ${price} грн</span>
        <div class="basket-controlsBlock">
            <div class="basket-controls">
                <span>Кількість:</span>
                <button type="button" class="minus">-</button>
                <input class="basket-item-quantity" type="number" min="1" max="99" value="1">
                <button type="button" class="plus">+</button>
            </div>
        </div>
    `;
    container.appendChild(item);

    const minusBtn = item.querySelector('.minus');
    const plusBtn = item.querySelector('.plus');
    const quantityInput = item.querySelector('.basket-item-quantity');

    plusBtn.addEventListener('click', () => {
        quantityInput.value = Number(quantityInput.value) + 1;
    });

    minusBtn.addEventListener('click', () => {
        let val = Number(quantityInput.value);
        if (val > 1) {
             quantityInput.value = val - 1;
        } else {
            if(confirm("Видалити цю піцу?")) {
                removeItem(item, id);
            }
        }
    });

    quantityInput.addEventListener('change', () => {
        if (quantityInput.value <= 0) {
             removeItem(item, id);
        }
    });
}

function removeItem(domElement, pizzaId) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    
    const index = basket.indexOf(pizzaId);
    if (index > -1) {
        basket.splice(index, 1);
    }
    
    localStorage.setItem("basket", JSON.stringify(basket));
    domElement.remove();
    
    if (basket.length === 0) {
        document.querySelector('.basket_container').innerHTML = '<h2 style="text-align:center;">Ваш кошик порожній</h2>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const accordionButtons = document.querySelectorAll('.accordion-btn');

    accordionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;

            content.classList.toggle('show');

            if (content.classList.contains('show')) {
                this.innerText = 'Приховати склад';
            } else {
                this.innerText = 'Показати склад';
            }
        });
    });
    
    const navLinks = document.querySelectorAll('footer nav a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('active-menu');
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('active-menu');
        });
    });

    const payButton = document.querySelector('.PayButton-Basket');
    const formContainer = document.querySelector('.customer-info');
    
    if (!payButton || !formContainer) return;

    const nameInput = formContainer.querySelector('input[name="name"]');
    const addressInput = formContainer.querySelector('input[name="address"]');
    const phoneInput = formContainer.querySelector('input[name="phone"]');

    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'display: none; color: #0F6B13; font-weight: bold; margin-bottom: 15px; text-align: center; font-family: "Inter";';
    successMsg.textContent = 'Замовлення успішно оформлено!';
    formContainer.parentNode.insertBefore(successMsg, formContainer);


    
    function loadFromStorage() {
        if (localStorage.getItem('basket_name')) nameInput.value = localStorage.getItem('basket_name');
        if (localStorage.getItem('basket_address')) addressInput.value = localStorage.getItem('basket_address');
        if (localStorage.getItem('basket_phone')) phoneInput.value = localStorage.getItem('basket_phone');
    }

    function saveToStorage(e) {
        if (e.target === nameInput) localStorage.setItem('basket_name', e.target.value);
        if (e.target === addressInput) localStorage.setItem('basket_address', e.target.value);
        if (e.target === phoneInput) localStorage.setItem('basket_phone', e.target.value);

        clearError(e.target);
    }

    loadFromStorage();
    formContainer.addEventListener('input', saveToStorage);

    payButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        let isValid = true;
        successMsg.style.display = 'none';

        if (nameInput.value.trim().length < 2) {
            showError(nameInput, "Мінімум 2 символи");
            isValid = false;
        } else {
            clearError(nameInput);
        }

        if (addressInput.value.trim().length < 5) {
            showError(addressInput, "Мінімум 5 символів");
            isValid = false;
        } else {
            clearError(addressInput);
        }


        const phoneRegex = /^\+380\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            showError(phoneInput, "Формат: +380XXXXXXXXX");
            isValid = false;
        } else {
            clearError(phoneInput);
        }

        if (isValid) {
            console.log({
                name: nameInput.value,
                address: addressInput.value,
                phone: phoneInput.value
            });

            nameInput.value = '';
            addressInput.value = '';
            phoneInput.value = '';
            localStorage.clear();

            successMsg.style.display = 'block';
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
    });

  
    
    function showError(input, message) {
        input.style.borderColor = '#e74c3c';
        
        const span = input.parentNode.querySelector('.error-msg');
        if (span) {
            span.textContent = message;
            span.style.display = 'block'; 
            span.style.color = '#e74c3c';
        }
    }

    function clearError(input) {
        input.style.borderColor = ''; 
        
        const span = input.parentNode.querySelector('.error-msg');
        if (span) {
            span.style.display = 'none';
        }
    }
    
});

var ThemaCount=0;
const savedTheme = localStorage.getItem('ThemaCount');

if(savedTheme!==null) {
    ThemaCount = parseInt(savedTheme, 10)
    if (ThemaCount === 1) {
        document.body.classList.add("dark-theme");
    }
}
else{
ThemaCount=0;
}
document.querySelector(".ThemaIcon").addEventListener("click", function(){
document.body.classList.toggle("dark-theme");
ThemaCount=(ThemaCount+1)%2;
localStorage.setItem('ThemaCount', ThemaCount);

});
setInterval(printdate,1000);

function printdate(){
var date = new Date();
var dateString = date.toDateString(); 
var timeString = date.toLocaleTimeString(); 
if(document.querySelector(".main-date")){
document.querySelector(".main-date").innerHTML = `<p>${dateString}</p>
<p>Time:  ${timeString}</p>`;}}
document.addEventListener("DOMContentLoaded", () => {
    
    const addButtons = document.getElementsByClassName("add-pizza");
    if (addButtons.length > 0) {
        for (let el of addButtons) {
            el.addEventListener('click', () => {
                let basket = JSON.parse(localStorage.getItem("basket")) || [];
                if (el.id) {
                    basket.push(el.id);
                    localStorage.setItem("basket", JSON.stringify(basket));
                } else {
                    console.error("У кнопки немає ID!");
                }
            });
        }
    }

    const container = document.querySelector('.basket_container');
    
    if (!container) return; 

    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    
    if (basket.length === 0) {
        container.innerHTML = '<h2 style="text-align:center;">Ваш кошик порожній</h2>';
    } else {
        for (let pizzaId of basket) {
             if (pizzaId === "Єгоро") {
                addPizzaToBasket(["Єгоро","Піца Єгоро","Томатний соус, моцарела, шинка, салямі, зелений перець, оливки, курячі яйця.",300,"./images/ImagesOfPizzas/egorro_pizza.jpg"]);
            }
            if (pizzaId === "Діабло") {
                addPizzaToBasket(["Діабло","Піца Діабло","Томатний соус, моцарела, пепероні, перець халапеньйо, пластівці чилі.",150,"./images/ImagesOfPizzas/diablo_pizza.jpg"]);
            }
            if (pizzaId === "Гаваї") {
                addPizzaToBasket(["Гаваї","Піца Гаваї","Томатний соус, моцарела, шинка, ананаси",150,"./images/ImagesOfPizzas/gawai_pizza.jpg"]);
            }
            if (pizzaId === "Маргарита") {
                addPizzaToBasket(["Маргарита","Піца Маргарита","оматний соус, моцарела, свіжий базилік.",150,"./images/ImagesOfPizzas/margaritta_pizza.jpg"]);
            }
        }
    }

    const clearBtn = document.querySelector('.ClearButton-Basket');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirm("Очистити кошик?")) {
                localStorage.removeItem("basket");
                container.innerHTML = '<h2 style="text-align:center;">Ваш кошик порожній</h2>';
            }
        });
    }
});