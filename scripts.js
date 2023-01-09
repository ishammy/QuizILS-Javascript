
// Element Variables in Quiz.html
window.localStorage.setItem("custom_categories", JSON.stringify('["My Mathematics", "Alisha\'s Quiz"]'))
var question_label = document.getElementById("question")
var quiz_container = document.getElementById("quiz-container");
var finish_quiz_container = document.getElementById("quiz-finish-container")
var loading_screen = document.getElementById("loading-screen")
var error_screen = document.getElementById('error-screen')
var score_label = document.getElementById("score")
var quiz_info = document.getElementById("quiz-info")
// Element Variables in Index.html
var category_select; 
var difficulty_select;
// VARIABLES FOR QUESTION GENERATION
var PASSING_SCORE = AMOUNT / 2; 
var CATEGORY = "random"
var DIFFICULTY = "random"
var AMOUNT = 5
var TYPE = "multiple"

var SCORING = "number" // For future feature
var IS_CUSTOM = "false"
var TIMER = 10

var api_url = "https://opentdb.com/api.php?"

// The Questions 
var score = 0;
var questions = [] 
var currentNumber = 0;
var answers = []
var timeLeft = 0

document.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }

  })
// Loading Settings 
async function loadSettings(){ 
    CATEGORY = window.localStorage.getItem("category_id")
    DIFFICULTY = window.localStorage.getItem("difficulty")
    TYPE = window.localStorage.getItem("type")
    PASSING_SCORE = window.localStorage.getItem("passing_score")
    AMOUNT = window.localStorage.getItem("total_questions")
    IS_CUSTOM = window.localStorage.getItem('is_custom')


}
// Generate Questions from API 
async function generateQuestions(){
    loadSettings();
    console.log(IS_CUSTOM)
    if(IS_CUSTOM == "true") {
        await generateCustom()
    }else{
        await generateFromAPI()
    }
    if(questions.length < AMOUNT) {
        AMOUNT = questions.length
    }

}
async function generateCustom(){
    console.log(CATEGORY)
    var custom_categories = {"alisha": "aboutme.json"}
    await fetch(`custom_quizzes/${custom_categories[CATEGORY]}`).then(res => res.json())
    .then(data => {
        console.log(data)
        unshuffled_questions = []
        for(question in data["results"]){
            unshuffled_questions.push(data['results'][question])
        }
        questions = unshuffled_questions
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    })
    
}
async function generateFromAPI(){ 
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
    api_url += "&amount=" + AMOUNT
    await fetch(api_url)
    .then(res => res.json())
    .then(data => {
        for(question in data['results']){
          questions.push(data["results"][question])
        }

    })
}

// Setting Questions 
async function setQuestion(i){

    var choice_1 = document.getElementById("choice_1")
    var choice_2 = document.getElementById("choice_2")
    // If the question isn't available 
    console.log(questions)
    try{ 
    quiz_info.innerHTML = "<p>Category: " + questions[i]["category"] + "</p>" + "<p>Difficulty: " + questions[i]["difficulty"] + "</p>" + "<p>Type: " + window.localStorage.getItem("type_name") + "</p>"
    }
    catch {
        error_screen.style.display = "block"
        return
    }
    score_label.innerHTML = "Score " + score
    question_label.innerHTML = '<span class="question-number">'+(i + 1)+'</span>' + questions[i]["question"]
    unshuffled_choices = []
    for(var j = 0; j < questions[i]["incorrect_answers"].length; j++){
      unshuffled_choices.push(questions[i]["incorrect_answers"][j])

    }
    unshuffled_choices.push(questions[i]["correct_answer"])
    let choices = unshuffled_choices
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    if(TYPE == "multiple"){
        var choice_3 = document.getElementById("choice_3")
        var choice_4 = document.getElementById("choice_4")
        choice_1.value = choices[0]
        choice_1.innerHTML = choices[0]
        choice_2.value = choices[1]
        choice_2.innerHTML = choices[1]
        choice_3.value = choices[2]
        choice_3.innerHTML = choices[2]
        choice_4.value = choices[3]
        choice_4.innerHTML = choices[3]
    } else if (TYPE == "boolean"){
        choice_1.value = choices[0]
        choice_1.innerHTML = choices[0]
        choice_2.value = choices[1]
        choice_2.innerHTML = choices[1]
    }
    quiz_container.style.display = "block"

}

async function startQuiz(){ 
    await generateQuestions()
    loading_screen.style.display = 'none';
    if(TYPE == "multiple"){
        document.getElementById("choices").innerHTML = '<button id="choice_1" onclick="updateQuestion(this.value)">Choice 1</button><button id="choice_2" onclick="updateQuestion(this.value)">Choice 2</button><button id="choice_3" onclick="updateQuestion(this.value)">Choice 3</button><button id="choice_4" onclick="updateQuestion(this.value)">Choice 4</button>'
    } else if(TYPE == "boolean"){
        document.getElementById("choices").innerHTML = '<button id="choice_1" onclick="updateQuestion(this.value)">Choice 1</button><button id="choice_2" onclick="updateQuestion(this.value)">Choice 2</button>'
    }
        setQuestion(currentNumber)
        startTimer()
}

function updateQuestion(val) {

        endTimer()
        startTimer()

    answers[currentNumber] = val
    if(currentNumber < AMOUNT - 1 ){
        if(answers[currentNumber] == questions[currentNumber]["correct_answer"]){
            addScore(); 
            var audio = new Audio('audio/click.mp3');
            audio.play();
        }else {
            var audio = new Audio('audio/wrong.mp3');
            audio.play();
            document.getElementById("quiz-container").animate([
                // keyframes
                {transform: 'translate3d(-1px, 0, 0)' },
                { transform: 'translate3d(2px, 0, 0)'}, 
                {transform: 'translate3d(-4px, 0, 0)'},
                {transform: 'translate3d(4px, 0, 0)'},
              ], {
                // timing options
                duration: 300,
                iterations: 1,
              });

        }
        currentNumber+= 1;

        setQuestion(currentNumber)

    }else {
        finishQuiz() 
    }

}
function finishQuiz() {
    endTimer()
    var audio = new Audio('audio/tadah.mp3');
    audio.play();
    quiz_container.style.display = "none"
    document.getElementById("user_score").innerHTML = score + " / " + AMOUNT
    finish_quiz_container.style.display = "block"
    console.log("Quiz Finished")
}
function quizResult() {
    var button = document.getElementById("see-result")
    var table_label = document.getElementById("quiz-result-table")
    var color = 'green'
    var table = `            
    <tr>
    <th>Question</th>
    <th>Correct Answer</th>
    <th>Your Answer</th>
    </tr>`
    for(var i = 0; i < questions.length;i++){ 
        if(answers[i] == questions[i]["correct_answer"]){
            color = "green"
        }
        else {
            color = "red"
        }
        table+=`        
        <tr>
        <td>${(i+1)+". " + questions[i]["question"]}</td>
        <td>${questions[i]["correct_answer"]}</td>
        <td style="color:${color};">${answers[i]}</td>
        </tr>
        `
    table_label.innerHTML = table
    button.style.display = "none"
    console.log(table)
    }
    
}
function addScore(){ 
    if(SCORING == "speed"){
        score += timeLeft * 15
    }
    if(SCORING == "number"){
        score += 1; 
    }
}

var countDown; 
function startTimer() {
    var timer = TIMER, seconds;
    function cd() {
            seconds = parseInt(timer % 60, 10);
            timeLeft = seconds
            seconds = seconds < 10 ? "0" + seconds : seconds;
        
            document.getElementById("timer").textContent =  seconds;

            if (--timer < 0) {
                updateQuestion("None")
            }
    }

    cd()
    countDown = setInterval(function (){ 

        cd(); 

    }, 1000);

}
function endTimer(){
    clearInterval(countDown)
}

var presets = [
    {"name":"About the Creator", "image_url": "images/creator_preset.jpg",  "preset":["alisha",  "random", "multiple", "Isha Test", 10, true]},
    {"name":"Random", "image_url": "images/random_preset.jpg",  "preset":["random",  "random", "multiple", "Multiple Choice", 10, false]},
    {"name":"Science", "image_url": "images/science_preset.jpg",  "preset":["17",  "random", "multiple", "Multiple Choice", 10, false]},
    {"name":"True or False", "image_url": "images/true_or_false_preset.jpg",  "preset":["random",  "random", "multiple", "Multiple Choice", 10, false]},

    {"name":"Random", "image_url": "images/random_preset.jpg",  "preset":["random",  "random", "multiple", "Multiple Choice", 10, false]},
    {"name":"Science", "image_url": "images/science_preset.jpg",  "preset":["17",  "random", "multiple", "Multiple Choice", 10, false]},
    {"name":"True or False", "image_url": "images/true_or_false_preset.jpg",  "preset":["random",  "random", "multiple", "Multiple Choice", 10, false]},

    
]
// Functions for Main Menu 

function scrollPresets(i){ 
    if(i == 1){ 
        location.href = "#preset_" + (presets.length - 1)

    }else if(i == -1){ 
        location.href = "#preset_" + 0
    }

}
async function createOptions() {
    await fetch('https://opentdb.com/api_category.php').then(res => res.json()).then(data => {
    
    var cs = document.createElement("select");
    cs.id = "categories";
    
    document.getElementById("category-option").appendChild(cs);
    category_select = document.getElementById('categories');
    var option = document.createElement("option");
    option.value = "random"
    option.text = "[ Random Category ]"
    category_select.appendChild(option)
    for(var i = 0; i < data["trivia_categories"].length; i++){
        var option = document.createElement("option");
        option.value = data["trivia_categories"][i]["id"]
        option.text = data["trivia_categories"][i]["name"]
        category_select.appendChild(option)
    }
    })

    var ds = document.createElement("select");
    ds.id = "difficulties";
    var difficulties = ["easy", "medium", "hard"]
    document.getElementById("difficulty-option").appendChild(ds);
    difficulty_select = document.getElementById('difficulties');
    var option = document.createElement("option");
    option.value = "random"
    option.text = "[ Random Difficulty ]"
    difficulty_select.appendChild(option)
    for(var i = 0; i < difficulties.length; i++){
        var option = document.createElement("option");
        option.value = difficulties[i]
        option.text = difficulties[i].toUpperCase()
        difficulty_select.appendChild(option)
    }
    var ts = document.createElement("select");
    ts.id = "types";
    var types = [ "Multiple Choice", "True or False"]
    document.getElementById("types-option").appendChild(ts);
    types_select = document.getElementById('types');
    for(var i = 0; i < types.length; i++){
        var option = document.createElement("option");
        option.value =(types[i] == "Multiple Choice") ? 'multiple' : 'boolean';
        option.text = types[i]
        types_select.appendChild(option)
    }

    var presets_select = document.getElementById("presets")
    for(var i = 0; i < presets.length; i++){
        var preset = document.createElement("div")
        preset.id = "preset_" + i
        preset.innerHTML = `                 
        <div class="bg" style="background: url('${presets[i].image_url}') center center;"></div>
        <div class="inside_box"><h1>${presets[i].name}</h1></div>`
   
        preset.setAttribute("onclick", `goToQuiz(${'\'' + presets[i].preset.join('\',\'') + '\''})`)
        presets_select.appendChild(preset)
    }



}
function goToQuiz(name="", difficulty="", type="", type_name="", total_questions="", is_custom=""){ 

    if(difficulty!=""){
        customPresets(name, difficulty, type, type_name, total_questions, is_custom)
    }else
     {
        window.localStorage.setItem("category_id", category_select.options[category_select.selectedIndex].value)
        window.localStorage.setItem("difficulty", difficulty_select.options[difficulty_select.selectedIndex].value)
        window.localStorage.setItem("type", types_select.options[types_select.selectedIndex].value)
        window.localStorage.setItem("type_name", types_select.options[types_select.selectedIndex].text)
        window.localStorage.setItem("passing_score", 10)
        window.localStorage.setItem("total_questions", 10)
        window.localStorage.setItem('is_custom', false)
    }
    location.href = "quiz.html"
}
function customPresets(category_id, difficulty, type, type_name, total_questions,  iscustom){ 

    window.localStorage.setItem("category_id", category_id)
    window.localStorage.setItem("difficulty", difficulty)
    window.localStorage.setItem("type", type)
    window.localStorage.setItem("type_name", type_name)
    window.localStorage.setItem("passing_score", total_questions/2)
    window.localStorage.setItem("total_questions", total_questions)
    window.localStorage.setItem('is_custom', iscustom)
}
async function loadMenu(){ 
    await createOptions()
    document.getElementById("loading-screen").style.display = "none"
    document.getElementById("container").style.display = "block"
}

// Functions for creating questions 

