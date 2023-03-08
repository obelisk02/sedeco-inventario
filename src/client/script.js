const loginSection = document.getElementById("loginSection");
const homeSection = document.getElementById("homeSection");
const popupHolder = document.getElementById("popupHolder");

if (document.cookie.includes("session_token=")) {
    loginSection.classList.add("hidden");
    homeSection.classList.remove("hidden");
    reloadItems();
}

async function callApi(api, method, data) {
    const result = await fetch("/api" + api, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!result.ok) {
        throw new Error();
    }

    return result.json();
}

function reloadItems() {
    callApi("/item/foruser", "GET").then((data) => {
        const itemHolder = document.getElementById("itemsSection");
        itemHolder.innerHTML = "";

        const createItem = (title, id) => {
            const itemElem = document.createElement("div");
            itemElem.classList.add("itemRow","centered_text", "subheader_text");
            itemElem.textContent = title;

            itemElem.addEventListener("click", () => {
                showItemPopup(id, title);
            });
            itemHolder.appendChild(itemElem);
        }

        if (data.length == 0) {
            createItem("No Items!");
        } else {
            for (const item of data) {
                createItem(item.title, item.id);
            }
        }
    }).catch((e) => {
        console.error("Could not get items: ", e);
    })
}

function closePopup() {
    popupHolder.classList.add("hidden");
}

function openPopup(title, bodyElement) { 
    popupHolder.classList.remove("hidden");
    document.getElementById("popupHeader").textContent = title;
    const popupBody = document.getElementById("popupBody");
    popupBody.innerHTML = "";
    popupBody.appendChild(bodyElement);
}

function showItemPopup(id, title) {
    const buttonHolder = document.createElement("div");

    const button1 = document.createElement("button");
    button1.textContent = "Edit";
    button1.classList.add("button", "button-purple_bg", 'buttonlabel_text' , 'white');
    buttonHolder.appendChild(button1);

    button1.addEventListener("click", () => {
        showEditPopup(id, title);
    });

    const button2 = document.createElement("button");
    button2.textContent = "Delete";
    button2.classList.add("button", "button-purple_bg", 'buttonlabel_text' , 'white');
    button2.style['margin-top'] = '15px';
    buttonHolder.appendChild(button2);
    button2.addEventListener("click", () => {
        showConfirmDeletePopup(id);
    });

    openPopup("Item Options", buttonHolder);
}

function showEditPopup(id, title) {
    const holder = document.createElement("div");
    openPopup("Edit Item", holder);

    const textarea = document.createElement("textarea");
    textarea.classList.add("button-label_text", "gray_bg", "editItemTextarea");
    textarea.value = title;

    holder.appendChild(textarea);

    const button1 = document.createElement("button");
    button1.textContent = "Save";
    button1.classList.add("button", "button-purple_bg", 'buttonlabel_text' , 'white');
    button1.style['margin-top'] = '15px';
    holder.appendChild(button1);

    button1.addEventListener("click", () => {
        const newTitle = textarea.value;
        callApi(`/item/${id}`, "PATCH", { title: newTitle }).then(() => {
            closePopup();
            reloadItems();
        }).catch((e) => {
            console.error("Failed to update item", e);
        });
    });
}

function showConfirmDeletePopup(id) {
    const holder = document.createElement("div");
    openPopup("Confirm", holder);

    const textHolder = document.createElement("div");
    textHolder.classList.add("buttonlabel_text", "white", "centered_text");
    textHolder.textContent = "Are you sure you want to delete this item?";
    holder.appendChild(textHolder);

    const button1 = document.createElement("button");
    button1.textContent = "Delete";
    button1.classList.add("button", "button-purple_bg", 'buttonlabel_text' , 'white');
    button1.style['margin-top'] = '15px';
    holder.appendChild(button1);

    button1.addEventListener("click", () => {
        callApi(`/item/${id}`, "DELETE").then(() => {
            closePopup();
            reloadItems();
        }).catch((e) => {
            console.error("Could not delete item", e);
        })
    })
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const errorHandler = document.getElementById("loginFormError");

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    errorHandler.textContent = "";
    callApi("/user/login", "POST", { username, password }).then((data) => {
        loginSection.classList.add("hidden");
        homeSection.classList.remove("hidden");
        reloadItems();
    }).catch((e) => {
        errorHandler.textContent = "Error logging in!";
    });
});

document.getElementById("createItemForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const errorHandler = document.getElementById("createItemFormError");

    const title = document.getElementById("newItemTitle").value;

    errorHandler.textContent = "";
    document.getElementById("newItemTitle").value = "";
    callApi("/item", "POST", { title }).then(() => {
        reloadItems();
    }).catch((e) => {
        errorHandler.textContent = "Error Creating Item!";
    });
});