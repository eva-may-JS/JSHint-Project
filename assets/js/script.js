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

async function postForm(e) {
    /* FormData is a JS interface which captures all the fields in an HTML form and returns them as an object
    which we can then give to "fetch()" */
    const form = new FormData(document.getElementById("checksform"));

    // This for loop was a test to see if FormData was working (returning the form fields as an object)
    /*for (let el of from.entries()) {
        console.log(el); 
    } */

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