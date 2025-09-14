import { menuArray } from './data.js'

// Meal Deal
const DEALS = {
    gameDay: {
        enabled: true,
        badgeText: "🔥Combo Deal"
    }
}

let selectedItem = []

function getItems() {
    return menuArray.map(function (items) {
        const showBadge = DEALS.gameDay.enabled && (items.name === "Pizza" || items.name === "Beer")
        const badge = showBadge ? `<span class="deal-badge">${DEALS.gameDay.badgeText}</span>` : ""
        return `<section class="itemCard">
                        <h2 class="emoji">${items.emoji}</h2>
                        <div class="alignElements">
                            <div class="itemInfo">
                                <h2 class="name">${items.name} ${badge}</h2>
                                <p class="ingredients">${items.ingredients}</p>
                                <h3 class="price">$${items.price}</h3>
                            </div>
                            <div class="addBtn" data-id="${items.id}" type="button">
                                <div class="signEclipse">+</div>
                            </div>
                        </div>
                    </section> `
    }).join('')
}

document.getElementById('itemsBodyBlock').innerHTML = getItems()

document.querySelectorAll('.addBtn').forEach(btn => {
    btn.addEventListener("click", function (e) {
        const itemId = e.currentTarget.dataset.id
        const item = menuArray.find(arrayItem => arrayItem.id == itemId)
        selectedItem.push(item)
        renderCheckout()
    })
})

function renderCheckout() {
    if (selectedItem.length === 0) {
        document.getElementById('checkout').innerHTML = ""
        return
    }

    let itemsHtml = selectedItem.map((item, index) => {
        return `<div class="preCheckoutItems">
                    <div class="preCheckoutStateItems">
                        <h2 class="name">${item.name}</h2>
                        <button class="removeBtn" data-index="${index}">remove</button>
                    </div>
                    <h3 class="preCheckoutPrice">$${item.price}</h3>
                </div>`
    }).join('')

    let total = selectedItem.reduce((sum, item) => sum + item.price, 0)

    // Game Day Combo
    const pizza = menuArray.find(menuArrayItem => menuArrayItem.name === "Pizza")
    const beer = menuArray.find(menuArrayItem => menuArrayItem.name === "Beer")

    const pizzaCount = selectedItem.filter(item => item.name === "Pizza").length
    const beerCount = selectedItem.filter(item => item.name === "Beer").length

    let discount = 0
    if (pizza && beer) {
        const combos = Math.min(Math.floor(pizzaCount / 2), Math.floor(beerCount / 2))
        // console.log(combos)
        if (combos > 0) {
            const comboValue = (2 * pizza.price) + (2 * beer.price)
            discount = combos * (comboValue * 0.2) // 20% off per combo
            total -= discount
        }
    }

    document.getElementById('checkout').innerHTML = `
    <section class="preCheckout">
        <h2 class="orderTitle">Your Order</h2>
        ${itemsHtml}
        <div class="totalPriceText">
            <h2 class="orderTotalPrice">Total Price:</h2>
            <h3 class="preCheckoutPrice totalPriceValue">$${total}</h3>
        </div>
        <button class="completeOrderBtn">Complete Order</button>
    </section>
    `

    document.querySelectorAll('.removeBtn').forEach(btn => {
        btn.addEventListener("click", function (e) {
            const index = e.currentTarget.dataset.index
            selectedItem.splice(index, 1)
            renderCheckout()
        })
    })

    const completeOrder = document.querySelector('.completeOrderBtn')

    if (completeOrder) {
        completeOrder.addEventListener("click", function () {
            renderPaymentModal()
        })
    }

    const paid = document.querySelector('.payBtn')

    if (paid) {
        paid.addEventListener("click", function () {
            orderCompleteState()
        })
    }
}

function renderPaymentModal() {
    document.getElementById('paymentModal').innerHTML = `
        <div class="modal" id="modal">
            <div class="modal-inner" id="modal-inner">
                <h2>Enter card details</h2>
                <form id="pay-form">
                    <input type="text" name="fullName" placeholder="Enter your name" required/>
                    <input type="text" name="cardNumber" placeholder="Enter card number" required/>
                    <input type="number" name="CVV" placeholder="Enter CVV" required/>

                    <div class="modal-choice-btns" id="modal-choice-btns">
                        <button type="submit" class="payBtn">Pay</button>
                    </div>
                </form>
            </div>
        </div> `

    const form = document.getElementById('pay-form')
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        orderCompleteState()
        selectedItem = []
        document.getElementById('paymentModal').innerHTML = ''
    })
}

function orderCompleteState() {
    document.getElementById('checkout').innerHTML = `
        <div class="orderCompleteMessage" id="orderCompleteMessage">
            <p class="message">Thanks! Your order is on its way!</p>
        </div>

        <div class="rating" id="rating">
            <span data-value="1">☆</span>
            <span data-value="2">☆</span>
            <span data-value="3">☆</span>
            <span data-value="4">☆</span>
            <span data-value="5">☆</span>
            <p class="ratingMsg" id="ratingMsg"></p>
        </div>
        `
    // Rating
    const stars = document.querySelectorAll('.rating span')
    const msg = document.getElementById('ratingMsg')

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const val = index + 1
            stars.forEach((starElement, starIndex) => starElement.textContent = starIndex < val ? '★' : '☆')
            msg.textContent = `You rated us ${val}/5 ⭐`
        })
    })
}

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});