'use strict';
// Global variables

const apiKey = 'ad90dc536d4b4fa3b7870e7a862dffe7';
const searchURL = 'https://api.spoonacular.com/recipes/search'

// Loop through results and append them to the UL in results section
function displayRecipeOptions(responseJson) {
    console.log('displayResults ran');
    $('#results-list').empty();
    for (let i = 0; i < responseJson.length; i++) {
        $('#results-list').append(
            `<li class="result-item">
           <img src="https://spoonacular.com/recipeImages/${responeJson.results[i].imageUrls}" class="results-img">
            <p>${responseJson.results[i].title}</p>
           <p>Prep time: ${responseJson.results[i].readyInMinutes}</p>
           <button type = "button" id="recipe-instructions"> See this recipe </button>
        </li>`
        )
    };
    $('#results').removeClass('hidden');
}

// Takes recipe object and formats into proper string
// What happens for multiple values in same parameter


function formatIntolerances(intolerances) {
    console.log('formatRecipes ran');
    const intolerancesParam = intolerances.map((int,i) => 
        `intolerances=${intolerances[i]}`);
        return intolerancesParam.join('&');
        console.log(intolerancesParam);
}

// Puts parameters into object
// Calls formatRecipes to insert parameters into properly formatted string
// puts query string into proper URL
// Calls first fetch function to get random recipe response

function getRecipes(cuisine, diet, intolerances) {
    

    const queryString = formatIntolerances(intolerances);
    const aggregatedString = `?cuisine=${cuisine}&diet=${diet}&` + queryString;
    const url = searchURL + aggregatedString + `&number=3&apiKey=${apiKey}`;
    console.log(url);


    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayRecipeOptions(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getRecipeInstructions() {
    // Add event listener for click on desired recipe (move to the beginning - right when page loads)
   // Second fetch (whole code block a second)
   // Change name of displayResults and call separate function

}

// Event listener for desired recipe
// On click ('ul') li etc


// watch form or watch forms?
// getRecipes
function watchForm() {
    console.log('watchform ran');
    $('form').submit(event => {
        event.preventDefault();
        const cuisine = $('#cuisine').val();
        const diet = $('#diet').val();
        const intolerances = $('#intolerances').val();
        getRecipes(cuisine, diet, intolerances);
    });
}

$(watchForm);