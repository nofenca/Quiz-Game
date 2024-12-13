const root = document.querySelector("#root")
let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error("Error loading questions:", error);
        root.innerHTML = "Couldn't load the questions"
    }
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        return showSummary();
    }

    const question = questions[currentQuestion];

    root.innerHTML =
        `<div>

        <h2>${question.question}</h2>
        <div id="options">
        ${question.options.map((option, index) => `<button onclick="handleAnswer(${index})">${option}</button>`)
            .join("")}
        </div>

        <div>
        <p id="timer">Time left: 10 seconds</p>
        </div>

    </div>`;

    startTimer();
}


function handleAnswer(selectedIndex) {
    clearInterval(timer);

    const question = questions[currentQuestion];


    const isCorrect = question.options[selectedIndex] === question.answers;


    root.innerHTML += `<p>${isCorrect ? "Correct!" : "Wrong!"}
    </p>`;

    if (isCorrect) score++;
    currentQuestion++;
    setTimeout(showQuestion, 2000);
}

function startTimer() {
    let timeLeft = 10;
    document.querySelector("#timer").textContent = `Time left: ${timeLeft} seconds`;

    timer = setInterval(() => {
        timeLeft--;
        document.querySelector("#timer").textContent = `Time left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            currentQuestion++;
            showQuestion();
        }
    }, 1000);
}

function showSummary() {
    root.innerHTML =
        `<div>
        <h2>Summary</h2>
        <p>You got ${score} of ${questions.length} correct.</p>
        <button onclick="startQuiz()">Play again</button>
    </div>`;
}

loadQuestions();