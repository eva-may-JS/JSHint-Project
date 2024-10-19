// My personal API key
const API_KEY = "0ziN2BHGJFDKjQ7kL0ufoobbZ2w";
const API_URL = "https://ci-jshint.herokuapp.com/api";

//Will call the modal defined in our HTML with Bootstrap (the syntax is described in BS documentation)
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

//Make our "Check key" button connect to the function which will show us the expiry date of API_KEY
document.getElementById("status"). addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    //We are sending a GET request (by using the syntax defined in the instructions of the API)
    //What we want to be "Fetched". When the variables are filled in, this is the link to our API_KEY details
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //The variable for the returned (or "fetched") data
    const response = await fetch(queryString);

    //The variable for the returned (or "fetched") data translated into json
    const data = await response.json();

    //If there are no errors, display...
    if (response.ok) {
        displayStatus(data);
    }

    /* If there is an error/s. data.error will give us the error message from "data" 
    (the data we are getting from the API) */
    else {
        displayException(data);
        throw new Error(data.error);
    }
}

//The function for our modal to display the data we get back from the server (via the API)
function displayStatus (data) {

    const headingText = document.getElementById("resultsModalTitle");
    const bodyText = document.getElementById("results-content");

    headingText.innerText = "API Key Status";
    bodyText.innerHTML = `<div>Your key is valid until</div> <div>${data.expiry}</div>`;

    resultsModal.show();

}

/* Make our "Run Checks" button connect to the function which will post the user completed form and return
errors found in their JS code */
document.getElementById("submit"). addEventListener("click", e => postForm(e));

/* A function to change how the "options" parameter is sent to the API, as it won't recognise the way it is 
sent currently (as a separate array ["options", "value"] for every option), as we are told in its 
instructions */ 
function processOptions(form) {
    let optArray = [];

    for(let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    /* Adding the array we have just created to be the new value of "options". .join() converts 
    the array into a string, ensuring the different options are separated by commas as required by the 
    API instructions */
    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    /* FormData is a JS interface which captures all the fields in an HTML form and returns them as an object
    which we can then give to "fetch()" */
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // This for loop was a test to see if FormData was working (returning the form fields as an object)
    // And also that the parameters were being submitted in the correct format for our API
    for (let entry of form.entries()) {
        console.log(entry); 
    } 

    /*This is our POST request, of the API URL, demonstrating authorisation with our API KEY. 
    "body" is the main information we are sending and want a response to*/
    const response = await fetch(API_URL, {
                                            method: "POST",
                                            headers: {
                                                        "Authorization": API_KEY,
                                                        },
                                            body: form,
                            });
    const data = await response.json();

    /* If no errors, carry out displayErrors function (which will use the data obtained from the API to 
    tell our users if there are errors in their code) */
    if (response.ok) {
        displayErrors(data);
    }
    //If errors
    else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors (data) {
    //Heading of the modal which is called at the end of this function
    let heading = `JSHints results for ${data.file}`;

    //results will form the body of the modal
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    }
    else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    const headingText = document.getElementById("resultsModalTitle");
    const bodyText = document.getElementById("results-content");

    headingText.innerText = heading;
    bodyText.innerHTML = results;

    resultsModal.show();

}

function displayException(data) {

    let heading = `<div class="error-heading">An Exception Occurred</div>`;
    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}