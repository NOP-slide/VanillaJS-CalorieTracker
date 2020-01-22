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
        getItemById: (id) => {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: (name, calories) => {
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(item => {
                // Currently edited item is in data.currentItem
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        setCurrentItem: (item) => {
            data.currentItem = item;
        },

        getCurrentItem: () => {
            return data.currentItem;
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
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
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

        updateListItem: (theItem) => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                const itemId = item.getAttribute('id');

                if (itemId === `item-${theItem.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${theItem.name}: </strong> <em>${theItem.calories} Calories</em>
                    <a href="#!" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                    M.toast({ html: 'Meal updated!' });
                }
            });
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

        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        // Hide the ul (for when there are no items in the state)
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },

        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },

        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        }
    }

})();




// App controller
const App = ((ItemCtrl, UICtrl) => {

    const loadEventListeners = () => {
        const UISelectors = UICtrl.getSelectors();

        // Add item btn event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Disable submit on enter
        document.addEventListener("keypress", e => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update item click event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
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
        } else {
            M.toast({ html: 'Please enter meal and calories' });
        }
    }

    const itemEditClick = (e) => {
        e.preventDefault();
        if (e.target.classList.contains("edit-item")) {
            const listId = e.target.parentNode.parentNode.id; // Get the id of the <li> element containing this edit button
            const listIdArray = listId.split("-");
            const id = parseInt(listIdArray[1]);

            // Get entire item from id
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);

            // Put the item to edit up into the form
            UICtrl.addItemToForm();

        }

    }

    const itemUpdateSubmit = (e) => {
        e.preventDefault();

        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        // Update total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

    }


    // Public methods
    return {
        init: () => {
            // Set the initial state to not editing
            UICtrl.clearEditState();

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