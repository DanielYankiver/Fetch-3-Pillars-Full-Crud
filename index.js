// document.addEventListener("DOMContentLoaded", (evt) => {
//     INSIDE THE CALLBACK, YOU'RE GUARANTEED THAT THE PAGE HAS LOADED
// })

let foodsOL = document.querySelector(".ui.massive.list")
let foodForm = document.querySelector("form#new-food.fluid")

// 3)

foodForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let nameOfFood = evt.target.food_name.value
    // console.log(nameOfFood)

    // SPECIFICALLY JSON-SERVER, KEYS FOR YOUR BODY WILL BE 
    //   SAVED TO THE DATABASE IMMEDIATELY
    fetch("http://localhost:3000/foods", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nameOfFood,
            count: 1
        })
    })
        .then(res => res.json())
        .then((createdFoodObj) => {
            turnFoodObjToLi(createdFoodObj)
            evt.target.reset()
        })
})


// 1)

fetch("http://localhost:3000/foods")
    .then(res => res.json())
    .then((foodsArr) => {

        foodsArr.forEach((foodObj) => {
            turnFoodObjToLi(foodObj)
        })

    })


   
// 2)

// {} -> <li></li>
let turnFoodObjToLi = (food) => {
    // 1) Manually create outer most element 
    let foodLi = document.createElement("Li")
        foodLi.className = "item"

    // 2) Fill the contents of that element
    foodLi.innerHTML = `
        <p class="js-food middle aligned content">${food.name} - <span>${food.count}</span></p>
        <button class="increase">Increment</button>
        <button class="delete-button">X</button>
    `
    // 3) Slap on the DOM 
    foodsOL.append(foodLi)
    
    // 4) Grab elements out of the outermost element
    let theDeleteButton = foodLi.querySelector("button.delete-button")
                       // outerMostElement.querySelector()
    // console.log(theDeleteButton)
    let increaseButton = foodLi.querySelector(".increase")
    // console.log(increaseButton)
    let countSpan = foodLi.querySelector("span")


    // 5) Add the event listeners on the appropriate elementss
    theDeleteButton.addEventListener("click", (evt) => {
        // console.log(food, foodLi)
        fetch(`http://localhost:3000/foods/${food.id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then((emptyObject) => {
                foodLi.remove()
            })
    })




    increaseButton.addEventListener("click", (evt) => {
        // console.log("INCREASING", food)
        let theNewNumber = food.count + 1 

        // UPDATING THE BACKEND 
        fetch(`http://localhost:3000/foods/${food.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                count: theNewNumber
            })
        })
            .then(res => res.json())
            .then((updatedFoodObj) => {
                // console.log(updatedObj)

                // UPDATING OBJECT IN MEMORY 
                food.count = updatedFoodObj.count
                // ^ the line that allows the increment to keep going up w/o refresh
                
                // UPDATING THE DOM 
                countSpan.innerText = updatedFoodObj.count
            })

    })



}