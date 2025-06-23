from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)  # Enable cross-origin resource sharing for React frontend

# Function to interact with Ollama
def get_ollama_response(message):
    response1 = ollama.chat(
    model="llama3.1:8b",    
    messages=[
        {
        "role": "user",
        "content": message
        }
    ],
    )

    jstring = response1['message']['content']
    return jstring

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()  # Get the message from the frontend
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({"message": "Please provide a message."}), 400

    # Get the bot's response from Ollama
    bot_message = get_ollama_response(user_message)

    return jsonify({"message": bot_message})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)