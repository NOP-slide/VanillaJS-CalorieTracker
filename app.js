// Storage controller
const StorageCtrl = (() => {

    // Public methods
    return {
        storeItem: (newItem) => {
            let items;

            if (localStorage.getItem("items") === null) {
                items = [];
                items.push(newItem);
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                items.push(newItem);
                localStorage.setItem("items", JSON.stringify(items));
            }
        },
        getItemsFromStorage: () => {
            let items;

            if (localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }

            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach((item, i) => {
                if (updatedItem.id === item.id) {
                    items.splice(i, 1, updatedItem); // Replace old item with updated item
                }
            });

            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach((item, i) => {
                if (id === item.id) {
                    items.splice(i, 1); // Delete item
                }
            });

            localStorage.setItem("items", JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem("items");
        }
    }
})();



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
        items: StorageCtrl.getItemsFromStorage(),
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
        deleteItem: (id) => {
            // Get all item IDs
            const ids = data.items.map(item => {
                return item.id;
            });

            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },
        clearAllItems: () => {
            data.items = [];
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
        clearBtn: ".clear-btn",
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

        deleteListItem: (id) => {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
            M.toast({ html: 'Meal removed' });
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

        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(item => item.remove());
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
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {

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

        // Delete item button event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        // Clear all button event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
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

            // Store in local storage
            StorageCtrl.storeItem(newItem);

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

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

    }

    const itemDeleteSubmit = (e) => {
        e.preventDefault();

        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Update total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
    }

    const clearAllItemsClick = (e) => {
        e.preventDefault();

        ItemCtrl.clearAllItems();

        // Update total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();
        
        // Hide the ul
        UICtrl.hideList();

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

})(ItemCtrl, StorageCtrl, UICtrl);




App.init();