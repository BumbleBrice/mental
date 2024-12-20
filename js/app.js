class MentalCalcApp {
    constructor() {
        this.container = document.getElementById('app');
        this.score = 0;
        this.currentProblem = null;
        this.difficulty = {
            min: 0,
            max: 10,
            operations: ['+']
        };
        this.message = '';
        this.messageType = ''; // 'success' ou 'error'
    }

    updateDifficulty() {
        if (this.score >= 5) {
            this.difficulty.max = 20;
            this.difficulty.operations = ['+', '-'];
        }
        if (this.score >= 10) {
            this.difficulty.max = 50;
            this.difficulty.operations = ['+', '-', '*'];
        }
        if (this.score >= 15) {
            this.difficulty.max = 100;
        }
    }

    generateProblem() {
        const num1 = Math.floor(Math.random() * (this.difficulty.max - this.difficulty.min)) + this.difficulty.min;
        const num2 = Math.floor(Math.random() * (this.difficulty.max - this.difficulty.min)) + this.difficulty.min;
        const operation = this.difficulty.operations[Math.floor(Math.random() * this.difficulty.operations.length)];
        
        let answer;
        switch (operation) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
        }

        return {
            num1,
            num2,
            operation,
            answer
        };
    }

    render() {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('template');
        
        this.currentProblem = this.generateProblem();
        
        template.innerHTML = `
            <div class="game-container">
                <h1>Calcul Mental</h1>
                ${this.message ? `
                    <div class="message ${this.messageType}">
                        ${this.message}
                    </div>
                ` : ''}
                <div class="score">Score: ${this.score}</div>
                <div class="difficulty-info">
                    Niveau: ${Math.floor(this.score/5) + 1}
                    (Nombres jusqu'à ${this.difficulty.max}, 
                    Opérations: ${this.difficulty.operations.join(', ')})
                </div>
                <div class="problem">
                    ${this.currentProblem.num1} ${this.currentProblem.operation} ${this.currentProblem.num2} = ?
                </div>
                <input type="number" id="answer" class="answer-input" autofocus>
                <button id="check">Vérifier</button>
            </div>
        `;

        fragment.appendChild(template.content);
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
        
        this.bindEvents();
    }

    bindEvents() {
        const checkButton = document.getElementById('check');
        const answerInput = document.getElementById('answer');

        checkButton.addEventListener('click', () => this.checkAnswer());
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
    }

    checkAnswer() {
        const answerInput = document.getElementById('answer');
        const userAnswer = parseInt(answerInput.value);
        
        if (userAnswer === this.currentProblem.answer) {
            this.score++;
            this.updateDifficulty();
            this.message = 'Correct !';
            this.messageType = 'success';
        } else {
            this.message = `Incorrect ! La réponse était ${this.currentProblem.answer}`;
            this.messageType = 'error';
        }
        
        answerInput.value = '';
        this.render();
        
        // Effacer le message après 2 secondes
        setTimeout(() => {
            this.message = '';
            this.render();
        }, 2000);
    }

    init() {
        this.render();
    }
}

// Démarrage de l'application
const app = new MentalCalcApp();
app.init(); 