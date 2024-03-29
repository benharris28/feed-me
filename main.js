'use strict';
// Global variables

const apiKey = 'ad90dc536d4b4fa3b7870e7a862dffe7';
const searchURL = 'https://api.spoonacular.com/recipes/complexSearch';



 // Listen for click on "search again" button and reload form

function searchAgain() {
    $('#new-search').on('click', '#search-again', event => {
        $('#results').toggleClass('hidden');
        $('#form').removeClass('hidden');
        $('#new-search').toggleClass('hidden');



    })
}

// Open new window with recipe link

function displayDetailedRecipe(responseRecipe) {

    window.open(`${responseRecipe.sourceUrl}`,"_blank");

}

// Fetch detailed recipe instruction based on recipeId returned in previous responseJson
function getRecipeInstructions(recipeId) {
    
    const recipeDetailURL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=ad90dc536d4b4fa3b7870e7a862dffe7`;
  
    
    fetch(recipeDetailURL)
        .then (response => {
            if(response.ok) {
            return response.json();
            }
            throw new Error(response.statusText);
        })
        .then (responseRecipe => displayDetailedRecipe(responseRecipe))
        .catch(err => {
          
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            });
        }



    


// get recipe id from the chosen result
function getItemIdfromElement(item) {
   
    return $(item).closest('li').data('item-id');
 
}

// listen for click on chosen recipe and pass result ID to new fetch function
function watchRecipeClick() {
    
    $('#results-list').on('click','.recipe-instructions',
    event => {
       
        const recipeId = getItemIdfromElement(event.currentTarget);
        getRecipeInstructions(recipeId);
        
    });
}

// Loop through results and append them to the UL in results section


function displayRecipeOptions(responseJson) {
   
    $('#results-list').empty();
    for (let i = 0; i < responseJson.results.length; i++) {
        $('#results-list').append(
            `<li class="result-item" data-item-id="${responseJson.results[i].id}">
            <h3>Recipe ${i + 1}</h3>
            <img src="${responseJson.results[i].image}" class="results-img">
           
           <p>${responseJson.results[i].title}</p>
           <button type = "button" id="${responseJson.results[i].id}" class="recipe-instructions"> See this recipe </button>
        </li>`
        )
    };
    
    $('#results').removeClass('hidden');
    $('#new-search').removeClass('hidden');

   


}

// Takes recipe object and formats into proper string


function formatIntolerances(intolerances) {
    console.log('formatRecipes ran');
    const intolerancesParam = intolerances.map((int,i) => 
        `intolerances=${intolerances[i]}`);
        return intolerancesParam.join('&');
       
}

// Puts parameters into object
// Calls formatRecipes to insert parameters into properly formatted string
// puts query string into proper URL
// Calls first fetch function to get random recipe response

function getRecipes(cuisine, diet, intolerances) {
    

    const queryString = formatIntolerances(intolerances);
    let offsetTwo = Math.floor(Math.random() * 20);

    const aggregatedString = `?cuisine=${cuisine}&diet=${diet}&type=main-course&offset=${offsetTwo}&` + queryString;
    const url = searchURL + aggregatedString + `&number=3&apiKey=${apiKey}`;
   


    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        displayRecipeOptions(responseJson);
        $('#loader').toggleClass('hidden');
        $('#results').removeClass('hidden');

    })
    .catch(err => {
      
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    $('#form').toggleClass('hidden');
    $('#loader').removeClass('hidden');
    
}



// First event listener function that checks for form inputs
// Pulls out form values
// Calls getRecipes function which calls the recipes endpoint

function watchForm() {
    console.log('watchform ran');
    $('form').submit(event => {
        event.preventDefault();
        const cuisine = $('#cuisine').val();
        const diet = $('#diet').val();
        const intolerances = $('#intolerances').val();
        console.log(intolerances);
        getRecipes(cuisine, diet, intolerances);
    });
}

// Event listeners to start app
function makeRecipes() {
    watchForm();
    watchRecipeClick();
    searchAgain();
    
}

$(makeRecipes);

