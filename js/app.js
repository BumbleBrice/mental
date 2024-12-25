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
            '*': 3
        };
        this.titles = {
            1: "Apprenti Calculateur",
            2: "Jongleur de Chiffres",
            3: "Maître des Additions",
            4: "Virtuose des Opérations",
            5: "Seigneur des Mathématiques"
        };
        this.updateDifficulty();
    }

    loadScore() {
        const savedScore = localStorage.getItem('mentalCalcScore');
        return savedScore ? parseInt(savedScore) : 0;
    }

    saveScore() {
        localStorage.setItem('mentalCalcScore', this.score.toString());
    }

    updateDifficulty() {
        if (this.score <= 49) { // Palier 1
            this.difficulty = {
                min: 0,
                max: 9,
                operations: ['+'],
                digits: { num1: 1, num2: 1 }
            };
        }
        else if (this.score <= 124) { // Palier 2
            this.difficulty = {
                min: 0,
                max: 9,
                operations: ['+', '-'],
                digits: { num1: 1, num2: 1 }
            };
        }
        else if (this.score <= 199) { // Palier 3
            this.difficulty = {
                min: 0,
                max: 9,
                operations: ['+', '-', '*'],
                digits: { num1: 1, num2: 1 }
            };
        }
        else if (this.score <= 274) { // Palier 4
            this.difficulty = {
                min: 0,
                max: 99,
                operations: ['+', '-', '*'],
                digits: { num1: 1, num2: 2 }
            };
        }
        else if (this.score <= 350) { // Palier 5
            this.difficulty = {
                min: 0,
                max: 999,
                operations: ['+', '-', '*'],
                digits: { num1: 3, num2: 3 }
            };
        }
    }

    generateProblem() {
        let num1, num2;
        const operation = this.difficulty.operations[Math.floor(Math.random() * this.difficulty.operations.length)];
        
        // Génération des nombres selon le niveau
        if (this.score <= 49) { // Palier 1
            num1 = Math.floor(Math.random() * 10); // 0-9
            num2 = Math.floor(Math.random() * 10); // 0-9
        }
        else if (this.score <= 124) { // Palier 2
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
        }
        else if (this.score <= 199) { // Palier 3
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
        }
        else if (this.score <= 274) { // Palier 4
            num1 = Math.floor(Math.random() * 10); // 1 chiffre
            num2 = Math.floor(Math.random() * 90) + 10; // 2 chiffres (10-99)
        }
        else { // Palier 5
            num1 = Math.floor(Math.random() * 900) + 100; // 3 chiffres (100-999)
            num2 = Math.floor(Math.random() * 900) + 100; // 3 chiffres (100-999)
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

        // Log pour déboguer
        console.log('Problème généré:', {
            num1,
            num2,
            operation,
            answer,
            score: this.score,
            difficulty: this.difficulty
        });

        return {
            num1,
            num2,
            operation,
            answer
        };
    }

    getTitleAndLevel() {
        if (this.score <= 49) return { level: 1, title: this.titles[1] };
        if (this.score <= 124) return { level: 2, title: this.titles[2] };
        if (this.score <= 199) return { level: 3, title: this.titles[3] };
        if (this.score <= 274) return { level: 4, title: this.titles[4] };
        if (this.score <= 350) return { level: 5, title: this.titles[5] };
        return { level: 6, title: "Champion des Mathématiques" };
    }

    render() {
        const fragment = document.createDocumentFragment();
        const template = document.createElement('template');
        
        // Si le score est supérieur à 350, afficher le menu de sélection de niveau
        if (this.score > 350) {
            template.innerHTML = `
                <div class="game-container">
                    <h1>Félicitations !</h1>
                    <div class="message success">
                        Vous avez atteint le score maximum de 350 points !
                    </div>
                    <div class="level-selection">
                        <h2>Choisissez un niveau pour recommencer :</h2>
                        <button class="level-button" data-level="1">Niveau 1 - Additions</button>
                        <button class="level-button" data-level="2">Niveau 2 - Additions et Soustractions</button>
                        <button class="level-button" data-level="3">Niveau 3 - Multiplications</button>
                        <button class="level-button" data-level="4">Niveau 4 - Nombres à 2 chiffres</button>
                        <button class="level-button" data-level="5">Niveau 5 - Nombres à 3 chiffres</button>
                    </div>
                </div>
            `;

            fragment.appendChild(template.content);
            this.container.innerHTML = '';
            this.container.appendChild(fragment);

            // Ajouter les événements pour les boutons de niveau
            document.querySelectorAll('.level-button').forEach(button => {
                button.addEventListener('click', () => {
                    const selectedLevel = parseInt(button.dataset.level);
                    switch(selectedLevel) {
                        case 1: this.score = 0; break;
                        case 2: this.score = 50; break;
                        case 3: this.score = 125; break;
                        case 4: this.score = 200; break;
                        case 5: this.score = 275; break;
                    }
                    this.updateDifficulty();
                    this.saveScore();
                    this.currentProblem = this.generateProblem();
                    this.render();
                });
            });
            return;
        }

        this.currentProblem = this.generateProblem();
        const { level, title } = this.getTitleAndLevel();
        
        template.innerHTML = `
            <div class="game-container level-${level}">
                <h1>Calcul Mental</h1>
                <div class="player-info">
                    <div class="title">${title}</div>
                    <div class="level">Niveau ${level}/5</div>
                    <button id="reset" class="reset-button" title="Réinitialiser">
                        <svg class="reset-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M9 4L12 2L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="difficulty-info">
                    Opérations disponibles: ${this.difficulty.operations.join(', ')}
                </div>
                <div class="points-info">
                    Points par opération: <br> + (1pt), - (2pts), × (3pts)
                </div>
                <div class="problem">
                    ${this.currentProblem ? `${this.currentProblem.num1} ${this.currentProblem.operation} ${this.currentProblem.num2} = ?` : ''}
                </div>
                ${this.message ? `
                    <div class="message ${this.messageType}">
                        ${this.message}
                    </div>
                ` : ''}
                <form class="answer-form" id="answer-form">
                    <label for="answer" class="sr-only">Votre réponse</label>
                    <input type="number" id="answer" name="answer" class="answer-input" autofocus 
                           aria-label="Entrez votre réponse" required>
                    <button id="check">Vérifier</button>
                </form>
            </div>
        `;

        fragment.appendChild(template.content);
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
        
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('answer-form');
        const answerInput = document.getElementById('answer');
        const resetButton = document.getElementById('reset');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Vérifier qu'il y a un problème en cours
            if (this.currentProblem) {
                this.checkAnswer();
            }
        });

        resetButton.addEventListener('click', () => this.resetScore());
        
        // Garder le focus sur l'input
        answerInput.focus();
    }

    checkAnswer() {
        const answerInput = document.getElementById('answer');
        const userAnswer = parseInt(answerInput.value);
        
        // Empêcher les soumissions multiples
        if (!this.currentProblem) return;

        // Log pour déboguer
        console.log('Vérification:', {
            userAnswer,
            correctAnswer: this.currentProblem.answer,
            problem: this.currentProblem
        });

        if (userAnswer === this.currentProblem.answer) {
            const points = this.operationPoints[this.currentProblem.operation];
            this.score += points;
            this.updateDifficulty();
            this.message = `Correct ! +${points} points`;
            this.messageType = 'success';
        } else {
            this.score = Math.max(0, this.score - 1);
            this.updateDifficulty();
            this.message = `Incorrect ! La réponse était ${this.currentProblem.answer} (-1 point)`;
            this.messageType = 'error';
        }

        this.saveScore();

        // Vider l'input immédiatement
        answerInput.value = '';
        answerInput.focus();

        // Cacher le problème
        const problemDiv = document.querySelector('.problem');
        if (problemDiv) {
            console.log('Masquage du problème'); // Log pour déboguer
            problemDiv.classList.add('hidden'); // Ajout de la classe hidden
        }

        // Afficher le message
        this.render();

        // Générer le nouveau problème immédiatement
        this.currentProblem = this.generateProblem();
        if (problemDiv) {
            console.log('Affichage du problème'); // Log pour déboguer
            problemDiv.classList.remove('hidden'); // Retirer la classe hidden
        }
        this.render(); // Rendre le nouveau problème
        document.getElementById('answer').focus();
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