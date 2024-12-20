class MentalCalcApp {
    constructor() {
        this.container = document.getElementById('app');
        this.score = 0;
        this.currentProblem = null;
        this.difficulty = {
            min: 0,
            max: 9,
            operations: ['+'],
            digits: {
                num1: 1,
                num2: 1
            }
        };
        this.message = '';
        this.messageType = '';
        this.operationPoints = {
            '+': 1,
            '-': 2,
            '*': 3,
            '/': 4
        };
    }

    updateDifficulty() {
        if (this.score <= 100) { // Palier 1
            this.difficulty = {
                min: 0,
                max: 9,
                operations: ['+'],
                digits: { num1: 1, num2: 1 }
            };
        }
        else if (this.score <= 200) { // Palier 2
            this.difficulty = {
                min: 0,
                max: 9,
                operations: ['+', '-'],
                digits: { num1: 1, num2: 1 }
            };
        }
        else if (this.score <= 300) { // Palier 3
            this.difficulty = {
                min: 0,
                max: 99,
                operations: ['+', '-'],
                digits: { num1: 2, num2: 1 }
            };
        }
        else if (this.score <= 400) { // Palier 4
            this.difficulty = {
                min: 0,
                max: 99,
                operations: ['+', '-'],
                digits: { num1: 2, num2: 2 }
            };
        }
        else if (this.score <= 500) { // Palier 5
            this.difficulty = {
                min: 0,
                max: 99,
                operations: ['+', '-', '*'],
                digits: { num1: 2, num2: 1 }
            };
        }
        else if (this.score <= 600) { // Palier 6
            this.difficulty = {
                min: 0,
                max: 99,
                operations: ['+', '-', '*'],
                digits: { num1: 2, num2: 2 }
            };
        }
    }

    generateProblem() {
        let num1, num2;
        const operation = this.difficulty.operations[Math.floor(Math.random() * this.difficulty.operations.length)];
        
        // Génération des nombres selon le nombre de chiffres requis
        if (this.difficulty.digits.num1 === 1) {
            num1 = Math.floor(Math.random() * 10);
        } else {
            num1 = Math.floor(Math.random() * 90) + 10; // 10 à 99
        }
        
        if (this.difficulty.digits.num2 === 1) {
            num2 = Math.floor(Math.random() * 10);
        } else {
            num2 = Math.floor(Math.random() * 90) + 10; // 10 à 99
        }
        
        let answer;
        switch (operation) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                // Pour la soustraction, s'assurer que num1 > num2
                if (num1 < num2) [num1, num2] = [num2, num1];
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
        const level = Math.min(6, Math.floor(this.score / 100) + 1);
        
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
                    Niveau: ${level}/6
                    (${this.difficulty.operations.join(', ')})
                </div>
                <div class="points-info">
                    Points par opération: + (1pt), - (2pts), × (3pts)
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
            const points = this.operationPoints[this.currentProblem.operation];
            this.score += points;
            this.updateDifficulty();
            this.message = `Correct ! +${points} points`;
            this.messageType = 'success';
        } else {
            this.message = `Incorrect ! La réponse était ${this.currentProblem.answer}`;
            this.messageType = 'error';
        }
        
        answerInput.value = '';
        this.render();
    }

    init() {
        this.render();
    }
}

// Démarrage de l'application
const app = new MentalCalcApp();
app.init(); 