const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveBtns = document.querySelectorAll('.solid');
const addContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
//Item Listes
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

//Item
let updatedOnload = false;


//Initiallize Array 
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

let dragedItem;
let dragging = false;
let currentColumn;

//Get Arras from localStorage if avilable, set default values if not
function getSaveColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    }
    else{
        backlogListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completeListArray = ['Being cool', 'Getting stuff done'];
        onHoldListArray = ['Being uncool'];
    }
}



//set localstorage Arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
    
}

//Filter Arrays to remove empty
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}


//Create DOM Element for each list item
function createItemEl(columnEl, column, item, index) {
  
    //list item
    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
    columnEl.appendChild(listEl);
}

//Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    //Check localStorage once
    if(!updatedOnload) {
        getSaveColumns();

    }
    //Backlog Column
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index);
    });
    backlogListArray = filterArray(backlogListArray);
    //Progress Column
    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 1, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);
    //Complete Column 
    completeList.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 2, completeItem, index);
    });
    completeListArray = filterArray(completeListArray);

    //on Hold Column
    onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 3, onHoldItem, index);
    });
    onHoldListArray = filterArray(onHoldListArray);

    updatedOnload = true;
    updateSavedColumns();
}

//Update Item - Delete if necessary , or Update Array value
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            delete selectedArray[id];
        }else{
            selectedArray[id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
}

//Add to Column List, Reset Textbox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent ='';
    updateDOM();
}

//show Add Item Input Box
function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveBtns[column].style.display = 'flex';
    addContainers[column].style.display = 'flex';
}

//Hide Item Input Box
function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible';
    saveBtns[column].style.display = 'none';
    addContainers[column].style.display = 'none';
    addToColumn(column);
}

//Allows arrays to reflect Drag and Drop
function rebuildArrays() {
    
    backlogListArray = [];
    for (let index = 0; index < backlogList.children.length; index++) {
        backlogListArray.push(backlogList.children[index].textContent);        
    }
    progressListArray = [];
    for (let index = 0; index < progressList.children.length; index++) {
        progressListArray.push(progressList.children[index].textContent);        
    }
    completeListArray = [];
    for (let index = 0; index < completeList.children.length; index++) {
        completeListArray.push(completeList.children[index].textContent);        
    }
    onHoldListArray = [];
    for (let index = 0; index < onHoldList.children.length; index++) {
        onHoldListArray.push(onHoldList.children[index].textContent);        
    }
    updateDOM();
}

//when Item Start Dragging
function drag(event) {
    dragedItem = event.target;
    dragging = true;
}

//Column Allows for Item to Drop
function allowDrop(event) {
    event.preventDefault();
}

//When Item Enter Column Area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}

//Dropping Item in Column
function drop(event) {
    event.preventDefault();
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });
    const parent = listColumns[currentColumn];
    parent.appendChild(dragedItem);
    dragging = false;
    rebuildArrays();
}

//on Load
updateDOM();