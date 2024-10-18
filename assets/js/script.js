// My personal API key
const API_KEY = "0ziN2BHGJFDKjQ7kL0ufoobbZ2w";
const API_URL = "https://ci-jshint.herokuapp.com/api";

//Will call the modal defined in our HTML with Bootstrap (the syntax is described in BS documentation)
const resultModal = new bootstrap.Modal(document.getElementById("resultsModal"));

//Make our "Check key" button show us the expiry date of API_KEY
document.getElementById("status"). addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    //What we want to be "Fetched". When the variables are filled in, this is the link to our API_KEY details
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //The variable for the returned (or "fetched") data
    const response = await fetch(queryString);

    //The variable for the returned (or "fetched") data translated into json
    const data = await response.json();

    //If there are no errors, display...
    if (response.ok) {
        console.log(data.expiry);
    }
}