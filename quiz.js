var choice_1 = document.getElementById("choice_1")
var choice_2 = document.getElementById("choice_2")
var choice_3 = document.getElementById("choice_3")
var choice_4 = document.getElementById("choice_4")
var question_label = document.getElementById("question")
var category_select;
var number = 0

var questions =[];
var DIFFICULTY = "easy"; 
var CATEGORY = "9"; 
var TYPE = "multiple"

var api_url = "https://opentdb.com/api.php?amount=50"

async function loadSettings(){ 

  fetch("settings.json").then(res => res.json())
  .then(settings => {
    CATEGORY = settings["category"]
    DIFFICULTY = settings["difficulty"]
    TYPE = settings["type"]
  })
}
async function generateQuestions(){
    loadSettings();
    if (CATEGORY == "random" || DIFFICULTY == "random"){
        if (DIFFICULTY != "random"){
            api_url += "&difficulty=" + DIFFICULTY;
        }
        else if (CATEGORY != "random"){
            api_url += "&category=" + CATEGORY;
        }
    }
    else{
        api_url += "&category=" + CATEGORY + "&difficulty=" + DIFFICULTY;
    }
    api_url += "&type=" + TYPE; 
    await fetch(api_url)
    .then(res => res.json())
    .then(data => {
        for(question in data['results']){
          questions.push(data["results"][question])
        }

    })

  }
var openSettings = () => {
  fetch('https://opentdb.com/api_category.php').then(res => res.json()).then(data => {
  
  var cs = document.createElement("select");
  cs.id = "categories";

  document.body.appendChild(cs);
  category_select = document.getElementById('categories');

  for(var i = 0; i < data["trivia_categories"].length; i++){
    var option = document.createElement("option");
    option.value = data["trivia_categories"][i]["id"]
    option.text = data["trivia_categories"][i]["name"]
    category_select.appendChild(option)
  }
})

}

category_select.addEventListener(
  'change',
  function() { 
    CATEGORY = category_select.options[category_select.selectedIndex].value
    console.log(CATEGORY)
   },
  false
);
function startQuiz(){ 
  location.href = "quiz.html"
  start();

}

function userAnswer(val) {
  number+= 1;
  console.log(val)
  setQuestion(number)
}
async function start(){ 


}

