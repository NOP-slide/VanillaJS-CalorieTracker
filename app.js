// Storage controller





// Item controller
const ItemCtrl = (() => {

    // Item object constructor
    function Item(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Item state
    const data = {
        items: [
            // { id: 0, name: 'Steak dinner', calories: 1200 },
            // { id: 1, name: 'Cookie', calories: 350 },
            // { id: 2, name: 'Taco Salad', calories: 650 }
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: () => {
            return data.items;
        },
        addItem: (name, calories) => {
            let ID;

            // Create new item ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            const newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: () => {
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });

            data.totalCalories = total;

            return total;
        },
        logData: () => {
            return data;
        }
    }
})();





// UI controller
const UICtrl = (() => {

    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }

    // Public methods
    return {
        populateItemList: (items) => {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#!" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        addListItem: (item) => {
            // Show the ul element
            document.querySelector(UISelectors.itemList).style.display = "block";

            // Build the new li element
            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#!" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            // Insert the element
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);

        },

        showTotalCalories: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        getSelectors: () => UISelectors,

        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        // Hide the ul (for when there are no items in the state)
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = "none";
        }
    }

})();




// App controller
const App = ((ItemCtrl, UICtrl) => {

    const loadEventListeners = () => {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
    }

    const itemAddSubmit = (e) => {
        e.preventDefault();

        // Get form input
        const input = UICtrl.getItemInput();

        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add new item to ui
            UICtrl.addListItem(newItem);

            // Update total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // Clear form fields
            UICtrl.clearInput();
        }
    }


    // Public methods
    return {
        init: () => {
            const items = ItemCtrl.getItems();

            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            // Update total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();

        }
    }

})(ItemCtrl, UICtrl);




App.init();
