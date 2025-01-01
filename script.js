// Variables
// grab html quiz
const quizForm = document.querySelector(".answerForm");
const startButton = document.querySelector(".startButton");
let correctAnswer;
// grab start screen
const startScreen = document.querySelector(".screen-start");
// grab question screen
const questionScreen = document.querySelector(".screen-question");
// grab correct screen
const correctScreen = document.querySelector(".screen-correct");
// grab fail screen
const failScreen = document.querySelector(".screen-fail");
// question counter
let questionTracker = 1;
// correct answer tracker
let correctAnswerTotal = 0;
// store the selected input
let selectedInput;

// Event Listeners
startButton.addEventListener("click", handleStartButton);

// const fetchCategories = fetch("https://opentdb.com/api_category.php")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (response) {
//     console.log(response);
//   });

function handleStartButton(e) {
  e.preventDefault();
  console.log("start button clicked");
  startScreen.classList.add("hide");
  questionScreen.classList.remove("hide");
  populateQuestions();
  document.querySelector(".progress").innerText = `1/10`;
  document.querySelector(".current-score").innerText = correctAnswerTotal;
}

// On page load grab a list of ten questions from the trivia api ✅
// Create a variable to store the questions returned from the api that I can access later
const fetchQuestions = fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    // decode response
    response.results.forEach((question) => {
      question.question = decodeHTML(question.question);
      question.correct_answer = decodeHTML(question.correct_answer);
      question.incorrect_answers = question.incorrect_answers.map(decodeHTML);
    });
    return response;
  });

// Decode helper function for decoding html entities
function decodeHTML(text) {
  const parser = new DOMParser();
  let doc = parser.parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

// Player is presented with a question screen with the first question and four options to choose from
// addEventListener("load", populateQuestions);

function populateQuestions() {
  fetchQuestions.then(function (response) {
    //store current question object in a variable
    const currentQuestion = response.results[questionTracker];
    //set correct answer to the correct answer of the current question
    correctAnswer = currentQuestion.correct_answer;
    //populate h3 with current question title
    document.querySelector("h3").innerText = currentQuestion.question;
    //create one array with correct answer and all three incorrect answers
    currentQuestion.incorrect_answers.push(currentQuestion.correct_answer);

    // shuffle the array of answers
    shuffleArray(currentQuestion.incorrect_answers);
    // loop through the array and assign the values to the answer options
    for (i = 0; i <= 3; i++) {
      const allQuestionInputs = document.querySelectorAll("input");
      document.querySelectorAll("span")[i].innerText =
        currentQuestion.incorrect_answers[i];
      allQuestionInputs[i].setAttribute(
        "id",
        currentQuestion.incorrect_answers[i]
      );
      allQuestionInputs[i].setAttribute(
        "value",
        currentQuestion.incorrect_answers[i]
      );
      allQuestionInputs[i].parentElement.setAttribute(
        "for",
        currentQuestion.incorrect_answers[i]
      );
    }
  });
}

// shuffle array function
function shuffleArray(arr) {
  for (i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

// Player selects answers and clicks Submit button ✅
quizForm.addEventListener("submit", handleAnswerSubmit);

// if no option is selected, prompt that they need to select an option ✅
function handleAnswerSubmit(e) {
  e.preventDefault();

  selectedInput = document.querySelector("input[name='answers']:checked");
  // Has answer been selected before pressing submit?
  if (!selectedInput) {
    alert("You have not selected an answer");
    return;
  }

  // storing selected options value as an answer to compare to the Correct answer
  const selectedAnswer = selectedInput.value;

  // if the correct answer is chosen, present a success screen with the option to proceed to the next question ✅
  if (selectedAnswer === correctAnswer) {
    questionScreen.classList.add("hide");
    correctScreen.classList.remove("hide");
    correctAnswerTotal++;
    document.querySelector(".current-score").innerText = correctAnswerTotal;
    console.log("Correct Answers: " + correctAnswerTotal);
  } else {
    // if the incorrect answer is chosen, present a fail screen with the option to proceed to the next question ✅
    questionScreen.classList.add("hide");
    failScreen.classList.remove("hide");
    // Display correct answer ✅
    failScreen.querySelector(".answerReveal").innerHTML =
      correctAnswer.toUpperCase();
  }
}

// if "next question" is clicked, present the question screen with the next question and four options to choose from
document
  .querySelector(".nextQuestionButton")
  .addEventListener("click", handleNextQuestion);
document
  .querySelector(".failNextQuestionButton")
  .addEventListener("click", handleNextQuestion);

function handleNextQuestion() {
  if (questionTracker < 9) {
    populateQuestions();
  } else {
    alert(`no more questions, you got ${correctAnswerTotal} questions correct`);
  }
  questionTracker++;
  questionScreen.classList.remove("hide");
  correctScreen.classList.add("hide");
  failScreen.classList.add("hide");
  selectedInput.checked = false;
  console.log(questionTracker);
  document.querySelector(".progress").innerText = `${questionTracker}/10`;
}
