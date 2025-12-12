from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для работы с frontend

# Хранилище ответов в памяти
answers_storage = []

# Жестко заданные вопросы анкеты
QUESTIONS = [
    {
        "id": 1,
        "question": "Как вас зовут?",
        "type": "text"
    },
    {
        "id": 2,
        "question": "Сколько вам лет?",
        "type": "number",
        "min": 10,
        "max": 100
    },
    {
        "id": 3,
        "question": "Какой ваш любимый язык программирования?",
        "type": "text",
        "type": "select",
        "options": [
            "C",
            "C#",
            "C++",
            "Go",
            "Java",
            "JavaScript",
            "Kotlin",
            "PHP",
            "Python",
            "R",
            "Ruby",
            "Rust",
            "Scala",
            "Swift",
            "TypeScript",
            "Visual Basic",
            "Assembly",
            "Dart",
            "MATLAB",
            "Perl"
        ]
    },
    {
        "id": 4,
        "question": "Оцените ваш опыт программирования (от 1 до 5)",
        "type": "number",
        "min": 1,
        "max": 5
    },
    {
        "id": 5,
        "question": "Что вас больше всего интересует в программировании?",
        "type": "text"
    }
]


@app.route('/questions', methods=['GET'])
def get_questions():
    """Возвращает список вопросов анкеты"""
    return jsonify(QUESTIONS)


@app.route('/answers', methods=['POST'])
def save_answers():
    """Принимает ответы пользователя и сохраняет их в памяти"""
    try:
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify({"error": "Неверный формат данных"}), 400
        
        # Сохраняем ответы с временной меткой
        answer_entry = {
            "answers": data['answers'],
            "timestamp": data.get('timestamp', None)
        }
        answers_storage.append(answer_entry)
        
        return jsonify({
            "message": "Ответы успешно сохранены",
            "total_answers": len(answers_storage)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/answers', methods=['GET'])
def get_answers():
    """Дополнительный endpoint для просмотра всех сохраненных ответов (для отладки)"""
    return jsonify({
        "total": len(answers_storage),
        "answers": answers_storage
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

