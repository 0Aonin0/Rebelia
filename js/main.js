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

document.addEventListener("DOMContentLoaded", () => {
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


//Налаштування теми
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