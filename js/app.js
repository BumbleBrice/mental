class MentalCalcApp {
    constructor() {
        this.container = document.getElementById('app');
        this.score = this.loadScore();
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
        this.updateDifficulty();
        this.titles = {
            1: "Apprenti Calculateur",
            2: "Jongleur de Chiffres",
            3: "Maître des Additions",
            4: "Virtuose des Opérations",
            5: "Seigneur des Multiplications",
            6: "Grand Sage des Mathématiques"
        };
    }

    loadScore() {
        const savedScore = localStorage.getItem('mentalCalcScore');
        return savedScore ? parseInt(savedScore) : 0;
    }

    saveScore() {
        localStorage.setItem('mentalCalcScore', this.score.toString());
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
        
        // Pour le palier 5, traitement spécial des multiplications
        if (this.score > 400 && this.score <= 500 && operation === '*') {
            // Multiplication à 1 chiffre uniquement
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
        } else {
            // Génération normale selon les digits requis
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
        }
        
        // Pour la soustraction, s'assurer que num1 > num2
        if (operation === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }
        
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

    getTitleAndLevel() {
        const level = Math.min(6, Math.floor(this.score / 100) + 1);
        return {
            level,
            title: this.titles[level]
        };
    }

    render() {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('template');
        
        this.currentProblem = this.generateProblem();
        const { level, title } = this.getTitleAndLevel();
        
        template.innerHTML = `
            <div class="game-container">
                <h1>Calcul Mental</h1>
                ${this.message ? `
                    <div class="message ${this.messageType}">
                        ${this.message}
                    </div>
                ` : ''}
                <div class="player-info">
                    <div class="title">${title}</div>
                    <div class="level">Niveau ${level}/6</div>
                    <button id="reset" class="reset-button">Réinitialiser</button>
                </div>
                <div class="difficulty-info">
                    Opérations disponibles: ${this.difficulty.operations.join(', ')}
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
        const resetButton = document.getElementById('reset');

        checkButton.addEventListener('click', () => this.checkAnswer());
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        resetButton.addEventListener('click', () => this.resetScore());
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
            this.score = Math.max(0, this.score - 1); // Empêche le score d'aller en négatif
            this.updateDifficulty();
            this.message = `Incorrect ! La réponse était ${this.currentProblem.answer} (-1 point)`;
            this.messageType = 'error';
        }
        
        this.saveScore();
        answerInput.value = '';
        this.render();
    }

    resetScore() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser votre score ?')) {
            this.score = 0;
            this.saveScore();
            this.updateDifficulty();
            this.message = 'Score réinitialisé';
            this.messageType = 'info';
            this.render();
        }
    }

    init() {
        this.render();
    }
}

// Démarrage de l'application
const app = new MentalCalcApp();
app.init(); 