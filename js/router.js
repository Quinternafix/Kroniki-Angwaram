export async function router() {

const app = document.getElementById("app");

switch(location.hash){

case "#/characters":

app.innerHTML = await charactersView();

break;

default:

app.innerHTML = homeView();

}

}