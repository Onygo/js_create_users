/* 
 * Eduvision
 * Cursus Javascript
 * 
 * Docent: Mark Nijenhuis
 * 
 * Dag 2
 * 12-09-2014
 */

window.addEventListener("load", onWindowLoad);

//console.log(document.getElementById("main").elements);

var defaultRow;
var storedNames;
var storedNamesArray;
var currentUserName;
var currentUserCountry;
var mainForm = document.getElementById("main");
var userForm = document.getElementById("addUser");
var table = document.getElementById('dataBody');
 
function onWindowLoad() {
    // All Eventlisteners
    mainForm.addEventListener("change", updateLocalStorage);
    userForm.addEventListener("submit", addUser); 
    document.getElementById('submitForm').addEventListener('click', storeData);
    document.getElementById('deleteRow').addEventListener('click', deleteRow);
    
    //document.getElementById("addUser").addEventListener("submit", addRow);    
    
    defaultRow = document.getElementById('dataRow').innerHTML;
    document.getElementById('dataBody').innerHTML = '';
    
    storedNames = localStorage.getItem('currentTable'); // Get Table Data from LocalStorage
    storedNamesArray = JSON.parse(storedNames);
    //console.log(storedNamesArray);
    
    buildTable();
}

function addRow() {
    var row = table.insertRow(0);
    row.innerHTML = defaultRow;
    
    row.cells[1].childNodes[0].value = currentUserName;
    row.cells[2].firstChild.selectedIndex = currentUserCountry;
    
    updateLocalStorage();
}

function addUser(e) {
    e.preventDefault();
    
    currentUserName = e.target.elements.item(0).value;
    currentUserCountry = e.target.elements.item(1).selectedIndex;
    document.getElementById('addUser').reset();
    
    addRow();
}

function storeData() {        
    var myRequest = new XMLHttpRequest();
    
    var formData = new FormData();
    formData.append('userData', storedNames);
    
    myRequest.onreadystatechange = function()
    {
        if (myRequest.readyState === 4 && myRequest.status === 200)
        {
            document.getElementById('resultaat').innerHTML = myRequest.responseText;
        }
    };

    myRequest.open('POST', 'insert.php', true);
    myRequest.send(formData);
}

function buildTable() {
    for ( var i = 0; i < storedNamesArray.length; i ++ ) {
        
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        
        row.innerHTML = defaultRow;
        
        row.cells[1].firstChild.value = storedNamesArray[i].Name;
	row.cells[2].firstChild.selectedIndex = storedNamesArray[i].Country;
    }
}
		
function updateLocalStorage() {
    var listFormElements = document.getElementById('main').elements;
    var formData =  '[ ';
        for ( var i = 0; i < listFormElements.length; i += 3 ) {
            formData += "{";
            formData += '"Name" : "' + listFormElements.item( i+1 ).value + '", ';
            formData += '"Country" : "' + listFormElements.item( i+2 ).selectedIndex + '"';
            formData += "}";
                if ( i < listFormElements.length - 3 ) {
                    formData += ', ';
                }
        }
    formData += ' ]';
    
    localStorage.setItem("currentTable", formData);
    console.log(localStorage.getItem("currentTable"));	
}

function deleteRow() {
    try {
        var rowCount = table.rows.length;

        for ( var i = 0; i < rowCount; i++ ) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0];

            if ( null !== chkbox && true === chkbox.checked ) { // Yoda Condition
                if ( rowCount <= 1 ) {
                    alert("Cannot delete all the rows.");
                    break;
                } else {
                    table.deleteRow(i);
                    rowCount--;
                    i--;
                    updateLocalStorage();
                }
            }
        }
    } catch(e) {
        alert(e);
    }
}