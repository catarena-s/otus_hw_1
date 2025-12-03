# Мини-анкета

Простое приложение для проведения анкетирования, состоящее из backend на Python (Flask) и frontend на HTML+JavaScript.

## Структура проекта

```
hw_1/
├── backend/          # Backend часть (Python Flask)
│   ├── app.py       # Основное приложение Flask
│   └── requirements.txt  # Зависимости Python
├── frontend/         # Frontend часть (HTML+JS)
│   ├── index.html   # Главная страница
│   ├── script.js    # JavaScript логика
│   └── styles.css   # Стили
└── README.md        # Документация
```

## Функционал

### Backend API

- **GET /questions** - возвращает список вопросов анкеты (5 вопросов)
- **POST /answers** - принимает ответы пользователя и сохраняет их в памяти
- **GET /answers** - дополнительный endpoint для просмотра всех сохраненных ответов (для отладки)

### Frontend

- Загружает вопросы с backend при открытии страницы
- Отображает форму с вопросами
- Отправляет заполненные ответы через POST /answers
- Показывает сообщение "Спасибо!" после успешной отправки

## Установка и запуск

### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Создайте виртуальное окружение (рекомендуется):
```bash
python -m venv venv
```

3. Активируйте виртуальное окружение:
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - Linux/Mac:
   ```bash
   source venv/bin/activate
   ```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

5. Запустите сервер:
```bash
python app.py
```

Backend будет доступен по адресу: `http://localhost:5000`

### Frontend

1. Откройте файл `frontend/index.html` в браузере

   Или используйте простой HTTP-сервер (например, встроенный в Python):
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Затем откройте в браузере: `http://localhost:8000`

## Использование

1. Запустите backend сервер (см. раздел "Backend")
2. Откройте frontend в браузере
3. Заполните форму с вопросами
4. Нажмите "Отправить ответы"
5. После успешной отправки вы увидите сообщение "Спасибо!"

## Технологии

- **Backend**: Python 3, Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)

