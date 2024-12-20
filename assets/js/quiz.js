class Quiz {
  constructor(category) {
    this.category = category;
    this.questions = quizData[category];
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.answeredQuestions = new Set();
    this.startTime = new Date();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);

    this.initializeQuiz();
  }

  updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - this.startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timeElement = document.getElementById("timeElapsed");
    if (timeElement) {
      timeElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  getCategoryTitle() {
    const titles = {
      french: "Kháng chiến chống Pháp",
      american: "Kháng chiến chống Mỹ",
      battles: "Những trận đánh nổi tiếng",
      figures: "Các nhân vật lịch sử",
    };
    return titles[this.category];
  }

  initializeQuiz() {
    document.getElementById("quizTitle").textContent = this.getCategoryTitle();
    this.updateQuestion();
    this.updateProgress();

    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.previousQuestion());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextQuestion());
    document
      .getElementById("retryBtn")
      .addEventListener("click", () => this.retry());
    document
      .getElementById("homeBtn")
      .addEventListener("click", () => this.goHome());
  }

  updateQuestion() {
    const question = this.questions[this.currentQuestion];
    document.getElementById("question").textContent = question.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "btn option-btn";
      button.textContent = option;

      if (this.answeredQuestions.has(this.currentQuestion)) {
        button.disabled = true;
        if (option === question.answer) {
          button.classList.add("correct");
          button.innerHTML = `${option} <i class="fas fa-check"></i>`;
        } else if (option === this.userAnswers[this.currentQuestion]) {
          button.classList.add("incorrect");
          button.innerHTML = `${option} <i class="fas fa-times"></i>`;
        }
      } else {
        button.addEventListener("click", () => this.selectAnswer(option));
      }

      optionsContainer.appendChild(button);
    });

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = this.currentQuestion === 0;
    nextBtn.textContent =
      this.currentQuestion === this.questions.length - 1
        ? "Kết thúc"
        : "Tiếp theo";
    nextBtn.disabled = !this.answeredQuestions.has(this.currentQuestion);
  }

  selectAnswer(selectedOption) {
    if (this.answeredQuestions.has(this.currentQuestion)) return;

    const question = this.questions[this.currentQuestion];
    this.userAnswers[this.currentQuestion] = selectedOption;
    this.answeredQuestions.add(this.currentQuestion);

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.textContent === question.answer) {
        button.classList.add("correct");
        button.innerHTML = `${button.textContent} <i class="fas fa-check"></i>`;
      } else if (
        button.textContent === selectedOption &&
        selectedOption !== question.answer
      ) {
        button.classList.add("incorrect");
        button.innerHTML = `${button.textContent} <i class="fas fa-times"></i>`;
      }
    });

    if (selectedOption === question.answer) {
      this.score++;
    }

    document.getElementById("nextBtn").disabled = false;
  }

  updateProgress() {
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.updateQuestion();
      this.updateProgress();
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.updateQuestion();
      this.updateProgress();
    } else {
      this.showResults();
    }
  }

  showResults() {
    clearInterval(this.timerInterval);
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - this.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    const totalQuestions = this.questions.length;
    const correctAnswers = this.score;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    document.getElementById("quizContent").classList.add("d-none");
    document.getElementById("results").classList.remove("d-none");

    document.getElementById("correctAnswers").textContent = correctAnswers;
    document.getElementById("wrongAnswers").textContent = wrongAnswers;
    document.getElementById("percentage").textContent = percentage;
    document.getElementById(
      "timeSpent"
    ).textContent = `${minutes} phút ${seconds} giây`;
  }

  retry() {
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.answeredQuestions.clear();
    this.startTime = new Date();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);

    document.getElementById("results").classList.add("d-none");
    document.getElementById("quizContent").classList.remove("d-none");
    this.updateQuestion();
    this.updateProgress();
  }

  goHome() {
    clearInterval(this.timerInterval);
    document.getElementById("results").classList.add("d-none");
    document.getElementById("quizContent").classList.add("d-none");
    document.querySelector(".quiz-container .row").classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadQuizData();
  document.querySelectorAll(".quiz-category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoryType = category.dataset.category;
      document.querySelector(".quiz-container .row").classList.add("d-none");
      document.getElementById("quizContent").classList.remove("d-none");
      new Quiz(categoryType);
    });
  });
});
