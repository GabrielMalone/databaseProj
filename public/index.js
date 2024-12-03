
//---------------------------------------------------------------------------------------------------------------
let dataList = null;
let submitButton = document.getElementById("submitButton");
let insertButton = document.getElementById("insertButton");
let removeSearchButton = document.getElementById('remove_search');
let deleteButton =  document.getElementById("deleteButton");
let searchBox = document.getElementById('update_search');
let inventoryButton = document.getElementById('inventory_button');
let idForFinalInventoryDelete = null;
let stockLine = document.getElementById('inventory-line');
let inventoryInputs = document.getElementById('inventoryInputs');
let addInvButton = document.getElementById('addInventoryMenuButton');
let remInvButton = document.getElementById('removeInventoryMenuButton');
let totalNumber = document.getElementById('totalNumber');
let OrdersearchBox = document.getElementById('order_search');
let OrderResultsArea = document.getElementById('OrderresultsArea');
let InventoryResultsArea = document.getElementById('resultsArea');
let monthlyReportArea = document.getElementById('monthlyReportArea');
let monthlyButton = document.getElementById('monthly_button');

let elementsList = [
    submitButton,
    insertButton,
    removeSearchButton,
    deleteButton,
    stockLine,
    inventoryInputs,
    addInvButton,
    remInvButton,
    searchBox,
    totalNumber,
    OrdersearchBox,
    OrderResultsArea,
    InventoryResultsArea,
    monthlyButton,
    monthlyReportArea
];

function hideElements() {
    elementsList.forEach(element => {
        if (element){
            if (element.style.visibility === 'visible')
                element.style.visibility = 'hidden';
        }
    });
}
//---------------------------------------------------------------------------------------------------------------
// Inventory Search Event Listener
//---------------------------------------------------------------------------------------------------------------
searchBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        inventory_search()
    }
    insertButton.style.visibility = "hidden";
});
//---------------------------------------------------------------------------------------------------------------
// Inventory Remove Event Listener
//---------------------------------------------------------------------------------------------------------------
removeSearchButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        deleteButton.style.visibility = "visible";
        removeInventory();
    }
    insertButton.style.visibility = "hidden";
});
//---------------------------------------------------------------------------------------------------------------
// Order Search Event Listener
//---------------------------------------------------------------------------------------------------------------
OrdersearchBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        order_search();
    }
    insertButton.style.visibility = "hidden";
});
//---------------------------------------------------------------------------------------------------------------
// Monthly Report Event Listener
//---------------------------------------------------------------------------------------------------------------
monthlyButton.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        show_report();
    }
    insertButton.style.visibility = "hidden";
});
//---------------------------------------------------------------------------------------------------------------
//  HANDLE QUERY FROM MAIN MENU BUTTONS
//---------------------------------------------------------------------------------------------------------------
function show_table_data(tableName) {
    hideElements();
    const elements = document.getElementsByClassName('queryOutput');
    for (let i = 0; i < elements.length; i++) {
    elements[i].style.visibility = 'visible';
    }
    const customQuery = {
        query: `SELECT * FROM mydb.${tableName}`,  // Query for the inventory table
        values: []  // No parameters needed for this query, so an empty array
    };
    // Send the query to the server
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customQuery),
        credentials: 'include',  // This sends cookies or authentication data with the request
      })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        display_data(data, tableName); 
        summary(tableName);
        //------------------------------------------------------------------------------------------------------
        // INVENTORY INTERACTION AREA
        //------------------------------------------------------------------------------------------------------
        if (tableName === 'Inventory'){
            searchBox.style.visibility = 'visible';
            addInvButton.style.visibility = 'visible';
            remInvButton.style.visibility = 'visible';
            totalStock(tableName);
            
        }
        //------------------------------------------------------------------------------------------------------
        // ORDER INTERACTION AREA
        //------------------------------------------------------------------------------------------------------
        if (tableName === 'Order'){
            OrdersearchBox.style.visibility = 'visible';
            totalStock(tableName);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
//---------------------------------------------------------------------------------------------------------------
//  SEND QUERY FOR SUMMARY OF DATA FROM TABLE
//---------------------------------------------------------------------------------------------------------------
function summary(tableName){
    const customQuery = {
        query: `SELECT COUNT(${tableName}ID)
                FROM mydb.${tableName}`,  // Query for the inventory table
        values: []  // No parameters needed for this query, so an empty array
    };
    // Send the query to the server
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        // Handle the data (e.g., display it on the page)
        console.log(data);
        display_unique_summary(data, tableName);  // Optional: A function to display the data
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
//---------------------------------------------------------------------------------------------------------------
//  SEND QUERY FOR SUMMARY OF DATA FROM TABLE
//---------------------------------------------------------------------------------------------------------------
function totalStock(tableName){
    const customQuery = {
        query: `SELECT SUM(QuantStock)
                FROM mydb.${tableName}`,  // Query for the inventory table
        values: []  // No parameters needed for this query, so an empty array
    };
    // Send the query to the server
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        // Handle the data (e.g., display it on the page)
        display_total_summary(data, tableName);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
//---------------------------------------------------------------------------------------------------------------
//  INVENTORY SEARCH
//---------------------------------------------------------------------------------------------------------------
function inventory_search(){
    const text = searchBox.value;
    const customQuery = {
        query: `SELECT *
                FROM mydb.Inventory
                WHERE InventoryID = ${text}`,  // Query for the inventory table
        values: []  // No parameters needed for this query, so an empty array
    };
    inventory_search_query(customQuery);
}       
//---------------------------------------------------------------------------------------------------------------
//  INVENTORY SEARCH QUERY
//---------------------------------------------------------------------------------------------------------------
function inventory_search_query(customQuery){
    InventoryResultsArea.style.visibility = 'visible';
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        // Handle the data (e.g., display it on the page)
        dataList = document.getElementById('resultsArea');
        dataList.innerHTML = ''; // Clear previous content
        // Loop through the results and display them
        data.forEach(item => {
            const listItem = document.createElement('div');
            // Structure the data to be displayed in the list item with editable fields
            listItem.innerHTML = `
                <label><strong>Inventory ID:</strong> 
                    <div id="inv_id">${item.InventoryID}</div>
                </label>
                <label><strong>Description:</strong> 
                    <input type="text" value="${item.Description}" class="editable-field" id="inv_desc" data-id="${item.Description}" data-field="Description">
                </label>
                <label><strong>Price:</strong> 
                    <input type="number" step="0.01" value="${item.Price.toFixed(2)}" class="editable-field"  id="inv_price" data-id="${item.Price}" data-field="Price">
                </label>
                <label><strong>Quantity in Stock:</strong> 
                    <input type="number" value="${item.QuantStock}" class="editable-field" id="inv_stock" data-id="${item.QuantStock}" data-field="QuantStock">
                </label>
                <label><strong>Date Stocked:</strong> 
                    <input type="date" value="${new Date(item.dateStocked).toISOString().split('T')[0]}" class="editable-field" id="inv_date" data-id="${item.dateStocked}" data-field="dateStocked">
                </label>
            `;
            // Append the list item to the list
            dataList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
    submitButton.style.visibility = "visible";
}
//---------------------------------------------------------------------------------------------------------------
function updateInventory(){
    const id = document.getElementById('inv_id').innerText;
    const description = document.getElementById('inv_desc').value;
    const price = document.getElementById('inv_price').value;
    const quantStock = document.getElementById('inv_stock').value;
    const dateStocked = document.getElementById('inv_date').value
    const formattedDate = `${dateStocked} 00:00:00`;
    const customQuery = {
        query: `UPDATE mydb.Inventory
                SET 
                    Description = ?, 
                    Price = ?, 
                    QuantStock = ?, 
                    dateStocked = ?
                WHERE InventoryID = ?`,  
        values: [description, price, quantStock, formattedDate, id]  // Use values as parameters
    };
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    submitButton.style.visibility = "hidden";
    insertButton.style.visibility = "hidden";
    inventory_search();
    show_table_data("Inventory");
    inventoryButton.click();
}
//---------------------------------------------------------------------------------------------------------------
function insertInventory(){
    deleteButton.style.visibility = "hidden";
    submitButton.style.visibility = "hidden";
    removeSearchButton.style.visibility = "hidden";
    if (searchBox.style.visibility = "hidden")
        searchBox.style.visibility = "visible";
    if (InventoryResultsArea.style.visibility = 'hidden'){
        InventoryResultsArea.style.visibility = 'visible'
    }
    const insertButton = document.getElementById('insertButton');
    insertButton.style.visibility = "visible";
    InventoryResultsArea.innerHTML = ''; // Clear previous content
    const listItem = document.createElement('div');
    listItem.innerHTML = `
        <label><strong>Description:</strong> 
            <input type="text" value="" class="editable-field" id="inv_desc_ins"data-field="Description">
        </label>
        <label><strong>Price:</strong> 
            <input type="number" step="0.01" class="editable-field"  id="inv_price_ins" data-field="Price">
        </label>
        <label><strong>Quantity in Stock:</strong> 
            <input type="number" value="0" class="editable-field" id="inv_stock_ins" data-field="QuantStock">
        </label>
        <label><strong>Date Stocked:</strong> 
            <input type="date" class="editable-field" id="inv_date_ins" data-field="dateStocked">
        </label>
    `;
    InventoryResultsArea.appendChild(listItem);
}

//---------------------------------------------------------------------------------------------------------------
function inventoryInsertQuery(){
    console.log("insert attempted");
    const description = document.getElementById('inv_desc_ins').value;
    const price = document.getElementById('inv_price_ins').value;
    const quantStock = document.getElementById('inv_stock_ins').value;
    const dateStocked = document.getElementById('inv_date_ins').value
    const formattedDate = `${dateStocked} 00:00:00`;
    InventoryResultsArea.style.visibility = 'visible';
    // now let's write the query to udpate
    const customQuery = {
        // Query for the inventory table
        query: `INSERT INTO mydb.Inventory (Description, Price, QuantStock, dateStocked) VALUES (?, ?, ?, ?)`,
        values: [description, price, quantStock, formattedDate]  // Use values as parameters
    };
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    });
    show_table_data("Inventory");
    inventoryButton.click();
   
}
//---------------------------------------------------------------------------------------------------------------
function removeInventory(){
    document.getElementById('update_search').style.visibility = "hidden";
    removeSearchButton.style.visibility = "visible";
    InventoryResultsArea.innerHTML = ''; // Clear previous content
    submitButton.style.visibility = "hidden";
    insertButton.style.visibility = "hidden";
    if (searchBox.style.visibility = "hidden")
        searchBox.style.visibility = "visible";
    if (InventoryResultsArea.style.visibility = 'hidden'){
        InventoryResultsArea.style.visibility = 'visible'
    }
    removeSearch = document.getElementById('remove_search');
    remove_data = removeSearch.value;
    console.log(remove_data);
    const customQuery = {
        query: `SELECT * FROM mydb.Inventory WHERE InventoryID = ${remove_data}`,  // Query for the inventory table
        values: []  // No parameters needed for this query, so an empty array
    };
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        InventoryResultsArea.innerHTML = ''; // Clear previous content
        const listItem = document.createElement('div');
        listItem.innerHTML = ``
        data.forEach(item => {
            const listItem = document.createElement('div');
            // Structure the data to be displayed in the list item with editable fields
            listItem.innerHTML = `
                <strong>Inventory ID:</strong> ${item.InventoryID}<br>
                <strong>Description:</strong> ${item.Description}<br>
                <strong>Price:</strong> $${item.Price.toFixed(2)}<br>
                <strong>Quantity in Stock:</strong> ${item.QuantStock}<br>
                <strong>Date Stocked:</strong> ${new Date(item.dateStocked).toLocaleDateString()}
            `;
            // Append the list item to the list
            InventoryResultsArea.appendChild(listItem);
            idForFinalInventoryDelete = item.InventoryID;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
//---------------------------------------------------------------------------------------------------------------
function finalDelete(){
    const customQuery = {
        query: `
                UPDATE
                    mydb.Inventory
                SET
                    QuantStock = ?
                WHERE
                    InventoryID = ?
                `,
        values: [0, idForFinalInventoryDelete]  
    };
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    });
    removeSearchButton.style.visibility = "hidden";
    deleteButton.style.visibility = "hidden";
    show_table_data("Inventory");
    inventoryButton.click();
}
//---------------------------------------------------------------------------------------------------------------
function display_unique_summary(data, tableName){
    uniqueCount = document.getElementById('uniqueCount');
    let indexer = `COUNT(${tableName}ID)`
    uniqueCount.innerHTML = `Unique ${tableName}: <span style="color: white;">${data[0][indexer]} </span>`;
}
//---------------------------------------------------------------------------------------------------------------
function display_total_summary(data, tableName){
    if (tableName === 'Inventory'){
        let indexer = `SUM(QuantStock)`;
        console.log(indexer);
        totalNumber.innerHTML = `Total Number of Items in Inventory: <span style="color: white;">${data[0][indexer]}</span>`;
        totalNumber.style.visibility = 'visible';
    } else {
        totalNumber.innerHTML = ``;
    }
}

//---------------------------------------------------------------------------------------------------------------
//  ORDER SEARCH
//---------------------------------------------------------------------------------------------------------------
function order_search(){
    const orerID = OrdersearchBox.value;
    const customQuery = {
        query: `SELECT 
                    o.Date,
                    c.firstName,
                    c.lastName,
                    i.Description, 
                    ohi.Quantity, 
                    FORMAT(SUM(ohi.Quantity * i.Price), 2) AS Total
                FROM 
                    mydb.Order AS o
                INNER JOIN 
                    mydb.Order_has_Inventory AS ohi ON o.OrderID = ohi.OrderID
                INNER JOIN 
                    mydb.Inventory AS i ON i.inventoryID = ohi.InventoryID
                INNER JOIN
                    mydb.Customer as c ON c.CustomerID = o.CustomerID
                WHERE 
                    o.OrderID = ${orerID}
                GROUP BY 
                    o.Date, c.firstName, c.lastName, i.Description, ohi.Quantity

                UNION ALL

                SELECT 
                    'Grand Total' AS Date,
                    '' AS firstName,
                    '' AS lastName,
                    '' AS Description, 
                    '' AS Quantity, 
                    FORMAT(SUM(ohi.Quantity * i.Price), 2) AS Total
                FROM 
                    mydb.Order AS o
                INNER JOIN 
                    mydb.Order_has_Inventory AS ohi ON o.OrderID = ohi.OrderID
                INNER JOIN 
                    mydb.Inventory AS i ON i.inventoryID = ohi.InventoryID
                WHERE 
                    o.OrderID = ${orerID};`,  
        values: []  
    };
    order_search_query(customQuery);
}
//---------------------------------------------------------------------------------------------------------------
//  ORDER SEARCH QUERY
//---------------------------------------------------------------------------------------------------------------
function order_search_query(customQuery){
    let date_shown = false;
    let name_shown = false;
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);

        OrderResultsArea.innerHTML = ''; // Clear previous content
        OrderResultsArea.innerHTML = `<strong><h1>RECEIPT</h1></strong><br>`; // Clear previous content
        OrderResultsArea.style.visibility = 'visible';

        // Loop through the results and display them
        data.forEach(item => {
            const listItem = document.createElement('div');
            let od = `<strong>Order Date:</strong> ${item.Date}<br><br>`;
            let fname = `<strong>Customer First:</strong> ${item.firstName}<br>`;
            let lname = `<strong>Customer Last:</strong> ${item.lastName}<br><br>`
            let desc = `<strong>Item Purchased:</strong> ${item.Description}<br>`
            let quant = `<strong>Quantity Purchased</strong> ${item.Quantity}<br>`;
            let total = `<strong>Line total </strong> $${item.Total}<br>`
            // date, first, last , desc, quant
            if (name_shown && date_shown){
                fname = ``;
                lname = ``;
                od = ``;
            }
            if (item.Date === "Grand Total"){
                quant = ``;
                desc = ``;
                total = `<strong> Grand Total: $${item.Total}</strong><br>`
            }
            console.log(item);
            listItem.innerHTML = `
                <br>
                ${od}
                ${fname}
                ${lname}
                ${desc}
                ${quant}
                ${total}
                <br>
            `;
            name_shown = true;
            date_shown = true;
            // Append the list item to the list
            OrderResultsArea.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
//---------------------------------------------------------------------------------------------------------------
//  INVENTORY OUTPUT
//---------------------------------------------------------------------------------------------------------------
function display_data(data, tableName) {
    if (dataList !== null){
        dataList.innerHTML = '';
    }
    if (tableName === 'Inventory'){
        dataList = document.getElementById('inventory-list');
        dataList.innerHTML = ''; // Clear previous content
        // Loop through the results and display them
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <br>
                <strong>Inventory ID:</strong> ${item.InventoryID}<br>
                <strong>Description:</strong> ${item.Description}<br>
                <strong>Price:</strong> $${item.Price.toFixed(2)}<br>
                <strong>Quantity in Stock:</strong> ${item.QuantStock}<br>
                <strong>Date Stocked:</strong> ${new Date(item.dateStocked).toLocaleDateString()}<br>
                <br>
            `;
            if (index % 2 === 0) {
                listItem.style.backgroundColor = "#ffffff1a;"; // Light gray for even index
            }
            // Append the list item to the list
            dataList.appendChild(listItem);
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    // CUSTOMER OUTPUT
    //---------------------------------------------------------------------------------------------------------------
    if (tableName === 'Customer'){
        dataList = document.getElementById('customer-list');
        dataList.innerHTML = ''; // Clear previous content
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <br>
                <strong>Customer ID:</strong> ${item.CustomerID}<br>
                <strong>First:</strong> ${item.firstName}<br>
                <strong>Last:</strong> ${item.lastName}<br>
                <strong>Phone: </strong> ${item.Phone}<br>
                <strong>Address: </strong> ${item.Address}<br>
                <strong>Country: </strong> ${item.Country}<br>
                <strong>City: </strong> ${item.City}<br>
                <strong>State: </strong> ${item.State}<br>
                <strong>Zip: </strong> ${item.PostalCode}<br>
                <br>
            `;
            if (index % 2 === 0) {
                listItem.style.backgroundColor = "#ffffff1a;"; 
            }
            dataList.appendChild(listItem);
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    // SUPPLIER OUTPUT
    //---------------------------------------------------------------------------------------------------------------
    if (tableName === 'Supplier'){
        dataList = document.getElementById('supplier-list');
        dataList.innerHTML = ''; // Clear previous content
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <br>
                <strong>Company ID:</strong> ${item.SupplierID}<br>
                <strong>Company Name:</strong> ${item.CompanyName}<br>
                <br>
            `;
            if (index % 2 === 0) {
                listItem.style.backgroundColor = "#ffffff1a;"; 
            }
            dataList.appendChild(listItem);
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    // CONTACT OUTPUT
    //---------------------------------------------------------------------------------------------------------------
    if (tableName === 'Contact'){
        dataList = document.getElementById('contact-list');
        dataList.innerHTML = ''; // Clear previous content
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <br>
                <strong>Cotact ID:</strong> ${item.ContactID}<br>
                <strong>First Name:</strong> ${item.firstName}<br>
                <strong>Last Name:</strong> ${item.lastName}<br>
                <strong>Phone:</strong> ${item.Phone}<br>
                <strong>Email:</strong> ${item.Email}<br>
                <strong>Associated With Supplier:</strong> ${item.SupplierID}<br>
                <br>
            `;
            if (index % 2 === 0) {
                listItem.style.backgroundColor = "#ffffff1a;"; 
            }
            dataList.appendChild(listItem);
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    // ORDER OUTPUT
    //---------------------------------------------------------------------------------------------------------------
    if (tableName === 'Order'){
        dataList = document.getElementById('order-list');
        dataList.innerHTML = ''; // Clear previous content
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <br>
                <strong>Order ID:</strong> ${item.OrderID}<br>
                <strong>Date:</strong> ${item.Date}<br>
                <strong>Customer ID:</strong> ${item.CustomerID}<br>
                <br>
            `;
            if (index % 2 === 0) {
                listItem.style.backgroundColor = "#ffffff1a;"; 
            }
            dataList.appendChild(listItem);
        });
    }
};

//---------------------------------------------------------------------------------------------------------------
// MONTHLY REPORT QUERY 
//---------------------------------------------------------------------------------------------------------------
function show_report(){
    hideElements();
    // -- Which Inventory Item has been in our inventory the longest?
    const customQuery = {
        query: `            
            SELECT
                -- Inventory item stocked the longest
                (SELECT CONCAT(Description, ' (Stocked on: ', dateStocked, ')')
                FROM mydb.Inventory 
                ORDER BY dateStocked ASC 
                LIMIT 1) AS Longest_Stocked_Item,

                -- Inventory with most items in stock
                (SELECT CONCAT(Description, ' (Items in stock: ', QuantStock, ')')
                FROM mydb.Inventory 
                ORDER BY QuantStock DESC 
                LIMIT 1) AS Most_Stocked_Item,

                -- Inventory with fewest items in stock
                (SELECT CONCAT(Description, ' (Items in stock: ', QuantStock, ')')
                FROM mydb.Inventory 
                ORDER BY QuantStock ASC 
                LIMIT 1) AS Least_Stocked_Item,
                
                -- Supplier with most popular items (supplier name and item name)
                (SELECT CONCAT(s.CompanyName, ' (Most popular item: ', i.Description, ')')
                FROM mydb.Supplier AS s
                INNER JOIN mydb.Inventory_and_Suppliers AS ias ON s.SupplierID = ias.SupplierID
                INNER JOIN mydb.Inventory AS i ON i.InventoryID = ias.InventoryID
                INNER JOIN mydb.Order_has_Inventory AS ohi ON ohi.InventoryID = i.InventoryID
                GROUP BY s.CompanyName, i.Description
                ORDER BY COUNT(s.SupplierID) DESC 
                LIMIT 1) AS Most_Popular_Supplier,
                
                -- Supplier providing unsold products
                (SELECT CONCAT(s.CompanyName, '')
                FROM mydb.Supplier AS s
                LEFT JOIN mydb.Inventory_and_Suppliers AS ias ON s.SupplierID = ias.SupplierID
                LEFT JOIN mydb.Inventory AS i ON i.InventoryID = ias.InventoryID
                LEFT JOIN mydb.Order_has_Inventory AS ohi ON ohi.InventoryID = i.InventoryID
                WHERE ohi.OrderID IS NULL
                LIMIT 1) AS Supplier_With_Unsold_Products,
                
                -- Most popular selling item overall (item name and times sold)
                (SELECT CONCAT(i.Description, ' (Sold ', COUNT(ohi.InventoryID), ' times)')
                FROM mydb.Inventory AS i
                INNER JOIN mydb.Order_has_Inventory AS ohi ON i.InventoryID = ohi.InventoryID
                GROUP BY i.Description
                ORDER BY COUNT(ohi.InventoryID) DESC 
                LIMIT 1) AS Most_Frequently_Sold_Item,
                
                -- Item purchased most in a single order (item name and max quantity sold)
                (SELECT CONCAT(i.Description, ' (Max Quantity in Single Order: ', MAX(ohi.Quantity), ')')
                FROM mydb.Inventory AS i
                INNER JOIN mydb.Order_has_Inventory AS ohi ON i.InventoryID = ohi.InventoryID
                GROUP BY i.Description
                ORDER BY MAX(ohi.Quantity) DESC 
                LIMIT 1) AS Most_Sold_In_One_Order,
                
                -- Supplier who supplies the max quantity sold in a single order
                (SELECT CONCAT(s.CompanyName, ' (Supplies: ', i.Description, ')')
                FROM mydb.Supplier AS s
                INNER JOIN mydb.Inventory_and_Suppliers AS ias ON s.SupplierID = ias.SupplierID
                INNER JOIN mydb.Inventory AS i ON i.InventoryID = ias.InventoryID
                INNER JOIN mydb.Order_has_Inventory AS ohi ON ohi.InventoryID = i.InventoryID
                GROUP BY s.CompanyName, i.Description
                ORDER BY MAX(ohi.Quantity) DESC
                LIMIT 1) AS Supplier_For_Most_Sold_Item_In_One_Order,

                -- Product that has never sold
                (SELECT CONCAT(i.Description, '')
                FROM mydb.Inventory AS i
                LEFT JOIN mydb.Order_has_Inventory AS ohi ON i.InventoryID = ohi.InventoryID
                WHERE ohi.InventoryID IS NULL 
                LIMIT 1) AS Unsold_Product,
                
                -- Product making the most money (product name and total revenue)
                (SELECT CONCAT(i.Description, ' (Total revenue: $', SUM(i.Price), ')')
                FROM mydb.Inventory AS i
                INNER JOIN mydb.Order_has_Inventory AS ohi ON i.InventoryID = ohi.InventoryID
                GROUP BY i.Description
                ORDER BY SUM(i.Price) DESC 
                LIMIT 1) AS Most_Profitable_Product,
                
                -- Supplier who sells the highest grossing product
                (SELECT CONCAT(s.CompanyName, ' (Highest grossing product: ', i.Description, ')')
                FROM mydb.Supplier AS s
                INNER JOIN mydb.Inventory_and_Suppliers AS ias ON s.SupplierID = ias.SupplierID
                INNER JOIN mydb.Inventory AS i ON i.InventoryID = ias.InventoryID
                INNER JOIN mydb.Order_has_Inventory AS ohi ON ohi.InventoryID = i.InventoryID
                GROUP BY s.CompanyName, i.Description
                ORDER BY SUM(i.Price) DESC 
                LIMIT 1) AS Supplier_For_Highest_Grossing_Product;`,

        values: []
    }
    //---------------------------------------------------------------------------------------------------------------
    // run  monthly report queries and display output
    //---------------------------------------------------------------------------------------------------------------
    fetch('https://databaseproj.onrender.com/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customQuery)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Query results:', data);
        const currentDate = new Date();
        const monthName = currentDate.toLocaleString('default', { month: 'long' }); // Get the full month name
        const year = currentDate.getFullYear();
        monthlyReportArea.innerHTML = ''; // Clear previous content
        monthlyReportArea.innerHTML = `<strong><h1>Monthly Report for ${monthName}, ${year}</h1></strong><br>`;
        monthlyReportArea.style.visibility = 'visible';

        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('container'); 
            
            let ls = `<p><strong>Item sitting the longest in stock:</strong> ${item.Longest_Stocked_Item}</p>`;
            let msi = `<p><strong>Most stocked Item:</strong> ${item.Most_Stocked_Item}</p>`;
            let lsi = `<p><strong>Least Stocked Item:</strong> ${item.Least_Stocked_Item}</p>`;
            let mfs = `<p><strong> Most frequently sold item:</strong> ${item.Most_Frequently_Sold_Item}</p>`;
            let smfs = `<p><strong>Supplier supplying most frequently sold product:</strong> ${item.Most_Popular_Supplier}</p>`
            let msoo = `<p><strong>Item sold the most in one order:</strong> ${item.Most_Sold_In_One_Order}</p>`
            let hgp = `<p><strong>Highest grossing product:</strong> ${item.Most_Profitable_Product}</p>`
            let sup = `<p><strong>Supplier supplying unsold products:</strong> ${item.Supplier_With_Unsold_Products}</p>`;
            let up = `<p><strong>Unsold product:</strong> ${item.Unsold_Product}</p>`
            let shgp = `<p><strong>Supplier for the highest grossing product:</strong> ${item.Supplier_For_Highest_Grossing_Product}</p>`
            let smso = `<p><strong>Supplier for the Most Sold Item in One Order:</strong> ${item.Supplier_For_Most_Sold_Item_In_One_Order}</p>`
            
            listItem.innerHTML = `
                ${mfs}
                ${smfs}
                ${msoo}
                ${smso}
                ${hgp}
                ${shgp}
                ${up}
                ${sup}
                ${ls}
                ${msi}
                ${lsi}
            `;
            monthlyReportArea.appendChild(listItem);
        });

    })
    .catch(error => {
        console.error('Error:', error);
    });
}
