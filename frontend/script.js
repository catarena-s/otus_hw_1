const API_BASE_URL = 'http://localhost:5000';

let questions = [];

// Загрузка вопросов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();

    // Обработчики кнопок
    document.getElementById('retakeBtn').addEventListener('click', resetForm);
    document.getElementById('viewAnswersBtn').addEventListener('click', showPreviousAnswers);
    document.getElementById('backToFormBtn').addEventListener('click', backToForm);

    // Обработчик кнопки просмотра ответов в шапке
    const viewAllBtn = document.getElementById('viewAllAnswersBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', showPreviousAnswers);
    }
});

// Функция загрузки вопросов с backend
async function loadQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/questions`);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке вопросов');
        }

        questions = await response.json();
        renderQuestions();

        // Скрываем индикатор загрузки и показываем форму
        document.getElementById('loading').style.display = 'none';
        document.getElementById('surveyForm').style.display = 'block';

        // Показываем кнопку просмотра ответов в шапке
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.style.display = 'block';
        }

    } catch (error) {
        showError('Не удалось загрузить вопросы. Убедитесь, что backend запущен на http://localhost:5000');
        console.error('Ошибка:', error);
    }
}

// Функция отображения вопросов в форме
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    questions.forEach((question) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';

        const label = document.createElement('label');
        label.textContent = question.question;
        label.setAttribute('for', `question-${question.id}`);

        let input;
        if (question.type === 'number') {
            input = document.createElement('input');
            input.type = 'number';
            // Устанавливаем min и max из данных вопроса, если они есть
            if (question.min !== undefined) {
                input.min = question.min.toString();
            }
            if (question.max !== undefined) {
                input.max = question.max.toString();
            }
        } else if (question.type === 'select' && question.options) {
            // Создаем выпадающий список
            input = document.createElement('select');
            // Добавляем пустую опцию по умолчанию
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Выберите язык --';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            input.appendChild(defaultOption);
            // Добавляем опции из списка
            question.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        input.id = `question-${question.id}`;
        input.name = `question-${question.id}`;
        input.required = true;

        questionDiv.appendChild(label);
        questionDiv.appendChild(input);
        container.appendChild(questionDiv);
    });
}

// Обработка отправки формы
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Собираем ответы
    const answers = {};
    questions.forEach((question) => {
        const input = document.getElementById(`question-${question.id}`);
        answers[question.id] = {
            question: question.question,
            answer: input.value
        };
    });

    try {
        const response = await fetch(`${API_BASE_URL}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: answers,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка при отправке ответов');
        }

        // Скрываем форму и показываем сообщение благодарности
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('thankYouMessage').style.display = 'block';
        // Скрываем кнопку просмотра ответов в шапке на странице благодарности
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.style.display = 'none';
        }

    } catch (error) {
        showError('Не удалось отправить ответы. Попробуйте еще раз.');
        console.error('Ошибка:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить ответы';
    }
});

// Функция отображения ошибки
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

// Функция сброса формы и начала нового опроса
function resetForm() {
    // Скрываем сообщение благодарности и предыдущие ответы
    document.getElementById('thankYouMessage').style.display = 'none';
    document.getElementById('previousAnswers').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Очищаем форму
    const form = document.getElementById('surveyForm');
    form.reset();

    // Явно очищаем все input поля на случай, если reset() не сработал
    questions.forEach((question) => {
        const input = document.getElementById(`question-${question.id}`);
        if (input) {
            input.value = '';
        }
    });

    // Сбрасываем состояние кнопки отправки
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить ответы';


    // Показываем форму
    form.style.display = 'block';

    // Показываем кнопку просмотра ответов в шапке
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        headerActions.style.display = 'block';
    }

    // Сбрасываем значения всех полей формы
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });
}

// Функция возврата к форме из просмотра ответов
function backToForm() {
    document.getElementById('previousAnswers').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Очищаем форму - сбрасываем все поля
    const form = document.getElementById('surveyForm');
    form.reset();

    // Явно очищаем все input поля на случай, если reset() не сработал
    questions.forEach((question) => {
        const input = document.getElementById(`question-${question.id}`);
        if (input) {
            input.value = '';
        }
    });

    // Сбрасываем состояние кнопки отправки
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить ответы';

    // Показываем форму
    form.style.display = 'block';

    // Показываем кнопку просмотра ответов в шапке
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        headerActions.style.display = 'block';
    }
}

// Функция загрузки и отображения предыдущих ответов
async function showPreviousAnswers() {
    try {
        const response = await fetch(`${API_BASE_URL}/answers`);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке ответов');
        }

        const data = await response.json();
        displayAnswers(data.answers);

        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        // Скрываем форму и сообщение благодарности, показываем ответы
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('thankYouMessage').style.display = 'none';
        document.getElementById('previousAnswers').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';

        // Скрываем кнопку просмотра ответов в шапке
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.style.display = 'none';
        }

    } catch (error) {
        showError('Не удалось загрузить ответы. Убедитесь, что backend запущен.');
        console.error('Ошибка:', error);
    }
}

// Функция отображения списка ответов
function displayAnswers(answers) {
    const container = document.getElementById('answersList');
    container.innerHTML = '';

    if (!answers || answers.length === 0) {
        container.innerHTML = '<p class="no-answers">Пока нет сохраненных ответов.</p>';
        return;
    }

    // Отображаем ответы в обратном порядке (самые новые первыми)
    answers.reverse().forEach((entry, index) => {
        const answerCard = document.createElement('div');
        answerCard.className = 'answer-card';

        const header = document.createElement('div');
        header.className = 'answer-header';
        header.textContent = `Ответ #${answers.length - index}`;

        if (entry.timestamp) {
            const timestamp = document.createElement('div');
            timestamp.className = 'answer-timestamp';
            const date = new Date(entry.timestamp);
            timestamp.textContent = date.toLocaleString('ru-RU');
            header.appendChild(timestamp);
        }

        answerCard.appendChild(header);

        const answersList = document.createElement('div');
        answersList.className = 'answers-list';

        // Сортируем ответы по ID вопроса
        const sortedAnswers = Object.keys(entry.answers)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => entry.answers[key]);

        sortedAnswers.forEach(answerData => {
            const answerItem = document.createElement('div');
            answerItem.className = 'answer-item';

            const question = document.createElement('div');
            question.className = 'answer-question';
            question.textContent = answerData.question;

            const answer = document.createElement('div');
            answer.className = 'answer-value';
            answer.textContent = answerData.answer;

            answerItem.appendChild(question);
            answerItem.appendChild(answer);
            answersList.appendChild(answerItem);
        });

        answerCard.appendChild(answersList);
        container.appendChild(answerCard);
    });
}

