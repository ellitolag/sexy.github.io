// script.js — мобильная версия с сенсорной оптимизацией

// --- СЛОВАРЬ АББРЕВИАТУР ---
const ABBR_DICT = {
    "АС (англ.)": "Переменное напряжение",
    "DC (англ.)": "Постоянное напряжение",
    "GCT (англ.)": "Тиристор коммутируемый управлением",
    "GTO (англ.)": "Тиристор включаемый (выключаемый) управлением",
    "IGBT (англ.)": "Биполярный транзистор с изолированным затвором",
    "IGCT (англ.)": "Интегрированный тиристор коммутируемый управлением",
    "MCT (англ.)": "Тиристор управляемый МОП",
    "UPS (англ.)": "Источник бесперебойного питания",
    "АБ": "Автоматическая блокировка",
    "АКБ": "Аккумуляторная батарея",
    "АЛС": "Автоматическая локомотивная сигнализация",
    "АТиС": "Автоматика, телемеханика и связь",
    "БЖД": "Белорусская железная дорога",
    "ВАХ": "Вольт-амперная характеристика",
    "ГАЦ": "Горочная автоматическая централизация",
    "ГОСТ": "Государственный стандарт",
    "ДВС": "Двигатель внутреннего сгорания",
    "ДГА": "Дизель-генераторный агрегат",
    "ДЦ": "Диспетчерская централизация",
    "ДЭС": "Двойной электрический слой",
    "ЖД": "Железная дорога",
    "ЗШ": "Зарядные шины",
    "ИБП": "Источник бесперебойного питания",
    "ИП": "Источник питания",
    "ИПН": "Преобразователь постоянного напряжения",
    "КЗ": "Короткое замыкание",
    "КМИ": "Корректор мощности искажений",
    "КНИ": "Коэффициент нелинейных искажений",
    "КПД": "Коэффициент полезного действия",
    "КС": "Контактная сеть",
    "КЭ": "Качество энергии",
    "ЛЭП": "Линии электропередач",
    "МОП": "Металл-оксид-полупроводник",
    "НЖ": "Никель-железный аккумулятор",
    "НК": "Никель-кадмиевый аккумулятор",
    "НРЦ": "Напряжение разомкнутой цепи",
    "НЭ": "Нелинейный элемент",
    "ОС": "Обратная связь",
    "ОТ": "Охрана труда",
    "ОУ": "Операционный усилитель",
    "ПАБ": "Полуавтоматическая блокировка",
    "ПК": "Персональный компьютер",
    "ПО": "Программное обеспечение",
    "ПП": "Пункты приема",
    "ПП НН": "Трансформаторные подстанции низкого напряжения",
    "ПС": "Подвижной состав",
    "ПТЭ": "Правила технической эксплуатации железной дороги",
    "ПУЭ": "Правила устройства электроустановок",
    "РШ": "Разрядные шины",
    "СУ": "Схема управления",
    "СЦБ": "Устройства сигнализации, централизации и блокировки",
    "ТП": "Трансформаторные подстанции",
    "ТС": "Телесигнализация",
    "ТУ": "Телеуправление",
    "ТЭ": "Топливный элемент",
    "УВУ": "Узел выходных усилителей",
    "УД": "Узел демпфирования",
    "УОС": "Узел обратной связи",
    "УСКР": "Узел суммирования и кондутивного разделения",
    "УТР": "Узел триггеров",
    "Ф": "Фидер",
    "ХИТ": "Химический источник тока",
    "ЦРП": "Центральные распределительные подстанции",
    "ЦСП": "Цифровая система передачи",
    "ЧИМ": "Частотно-импульсная модуляция",
    "ШИМ": "Широтно-импульсная модуляция",
    "ШПТ": "Шина переменного тока",
    "ЭДС": "Электродвижущая сила",
    "ЭПУ": "Электропитающие устройства",
    "ЭУ": "Электронные устройства",
    "ЭЦ": "Электрическая централизация",
    "ЭЧЭ": "Тяговые подстанции",
    "ЭЭ": "Электрическая энергия",
};

// --- Состояние ---
let questionsQueue = [];
let totalQuestions = 0;
let answeredCount = 0;
let correctCount = 0;
let skippedInQueue = 0;
let totalSkipsEver = 0;
let waitingNext = false;
let currentQ = null;

// DOM элементы
const abbreviationSpan = document.getElementById('abbreviation');
const answerInput = document.getElementById('answerInput');
const checkButton = document.getElementById('checkBtn');
const skipButton = document.getElementById('skipBtn');
const resultMsgDiv = document.getElementById('resultMessage');
const progressFill = document.getElementById('progressFill');

const statCorrectSpan = document.querySelector('#statCorrect .stat-value');
const statSkippedSpan = document.querySelector('#statSkipped .stat-value');
const statRemainingSpan = document.querySelector('#statRemaining .stat-value');

// Модальные элементы
const modal = document.getElementById('resultsModal');
const modalScorePercent = document.getElementById('scorePercent');
const modalScoreStats = document.getElementById('scoreStats');
const modalGradeMsg = document.getElementById('gradeMessage');
const modalStatCorrect = document.getElementById('modalStatCorrect');
const modalStatWrong = document.getElementById('modalStatWrong');
const modalStatSkipped = document.getElementById('modalStatSkipped');
const answersListDiv = document.getElementById('answersList');
const restartModalBtn = document.getElementById('restartBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Аккордеон
const accordionHeader = document.getElementById('accordionHeader');
const accordionContent = document.getElementById('accordionContent');

// --- Вспомогательные функции ---
function normalize(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function updateTopStats() {
    const remaining = questionsQueue.length;
    statCorrectSpan.innerText = correctCount;
    statSkippedSpan.innerText = skippedInQueue;
    statRemainingSpan.innerText = remaining;
    const donePercent = totalQuestions === 0 ? 0 : (answeredCount / totalQuestions) * 100;
    progressFill.style.width = `${donePercent}%`;
}

function loadNextQuestion() {
    if (questionsQueue.length === 0) {
        showResultsModal();
        return;
    }
    waitingNext = false;
    currentQ = questionsQueue[0];
    abbreviationSpan.innerText = currentQ.abbr;
    answerInput.disabled = false;
    answerInput.value = '';
    answerInput.focus();
    resultMsgDiv.innerHTML = '';
    resultMsgDiv.style.background = '';
    
    checkButton.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Проверить</span>';
    checkButton.classList.remove('skip-btn');
    checkButton.classList.add('primary-btn');
    skipButton.disabled = false;
    updateTopStats();
}

function showMessage(text, type) {
    resultMsgDiv.innerHTML = text;
    if (type === 'correct') {
        resultMsgDiv.style.background = 'rgba(0, 214, 143, 0.15)';
        resultMsgDiv.style.color = '#00d68f';
    } else if (type === 'wrong') {
        resultMsgDiv.style.background = 'rgba(255, 71, 87, 0.15)';
        resultMsgDiv.style.color = '#ff4757';
    } else {
        resultMsgDiv.style.background = 'rgba(255, 209, 102, 0.15)';
        resultMsgDiv.style.color = '#ffd166';
    }
}

function flashInputError() {
    const inputGroup = document.querySelector('.input-group');
    const originalBorder = inputGroup.style.borderColor;
    inputGroup.style.borderColor = '#ff4757';
    inputGroup.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.3)';
    setTimeout(() => {
        inputGroup.style.borderColor = '#2e3350';
        inputGroup.style.boxShadow = '';
    }, 500);
}

function checkAnswer() {
    if (waitingNext || !currentQ) return;
    const userAnswer = answerInput.value.trim();
    if (userAnswer === "") {
        flashInputError();
        showMessage('⚠️ Введите ответ!', 'wrong');
        return;
    }
    
    const q = questionsQueue.shift();
    answeredCount++;
    const isCorrect = (normalize(userAnswer) === normalize(q.correctMeaning));
    
    if (isCorrect) {
        correctCount++;
        if (q.skippedFlag) skippedInQueue--;
        showMessage(`✅ Правильно!`, 'correct');
    } else {
        if (q.skippedFlag) skippedInQueue--;
        showMessage(`❌ Неверно. Ответ: «${q.correctMeaning}»`, 'wrong');
    }
    
    waitingNext = true;
    answerInput.disabled = true;
    skipButton.disabled = true;
    checkButton.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Далее</span>';
    checkButton.classList.remove('primary-btn');
    checkButton.classList.add('skip-btn');
    updateTopStats();
}

function skipCurrent() {
    if (waitingNext || !currentQ || questionsQueue.length === 0) return;
    const q = questionsQueue.shift();
    if (!q.skippedFlag) {
        q.skippedFlag = true;
        skippedInQueue++;
        totalSkipsEver++;
    }
    questionsQueue.push(q);
    showMessage(`↩ Пропущено`, 'skip');
    loadNextQuestion();
}

function showResultsModal() {
    const wrongCount = totalQuestions - correctCount;
    const percent = totalQuestions === 0 ? 0 : (correctCount / totalQuestions) * 100;
    modalScorePercent.innerText = `${percent.toFixed(1)}%`;
    modalScoreStats.innerText = `${correctCount} из ${totalQuestions}`;
    
    let gradeText = '';
    let gradeColor = '#6c63ff';
    if (percent === 100) { gradeText = '🏆 Идеально!'; gradeColor = '#00d68f'; }
    else if (percent >= 80) { gradeText = '🔥 Отлично!'; gradeColor = '#6c63ff'; }
    else if (percent >= 60) { gradeText = '📚 Хорошо'; gradeColor = '#ffd166'; }
    else { gradeText = '📖 Нужно повторить'; gradeColor = '#ff4757'; }
    modalGradeMsg.innerHTML = `<span style="color:${gradeColor}">${gradeText}</span>`;
    modalStatCorrect.innerText = correctCount;
    modalStatWrong.innerText = wrongCount;
    modalStatSkipped.innerText = totalSkipsEver + skippedInQueue;
    
    const sortedEntries = Object.entries(ABBR_DICT).sort((a,b) => a[0].localeCompare(b[0]));
    answersListDiv.innerHTML = '';
    sortedEntries.forEach(([abbr, meaning], idx) => {
        const item = document.createElement('div');
        item.className = 'answer-item';
        item.innerText = `${idx+1}. ${abbr} → ${meaning}`;
        answersListDiv.appendChild(item);
    });
    
    const circle = document.getElementById('scoreCircleProgress');
    if (circle) {
        const circumference = 339.292;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function restartGame() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    const entries = shuffleArray(Object.entries(ABBR_DICT));
    questionsQueue = entries.map(([abbr, meaning]) => ({
        abbr: abbr,
        correctMeaning: meaning,
        skippedFlag: false
    }));
    totalQuestions = questionsQueue.length;
    answeredCount = 0;
    correctCount = 0;
    skippedInQueue = 0;
    totalSkipsEver = 0;
    waitingNext = false;
    currentQ = null;
    updateTopStats();
    loadNextQuestion();
}

// --- Обработчики событий ---
checkButton.addEventListener('click', () => {
    if (waitingNext) {
        loadNextQuestion();
    } else {
        checkAnswer();
    }
});

skipButton.addEventListener('click', skipCurrent);

// Глобальный обработчик для Enter (работает на телефонах с клавиатурой)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (waitingNext) {
            loadNextQuestion();
        } else if (!answerInput.disabled && currentQ) {
            checkAnswer();
        }
    }
});

// Для мобильных: обрабатываем Enter на поле ввода
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (waitingNext) {
            loadNextQuestion();
        } else {
            checkAnswer();
        }
    }
});

restartModalBtn.addEventListener('click', restartGame);
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    restartGame();
});

// Аккордеон
if (accordionHeader) {
    accordionHeader.addEventListener('click', () => {
        accordionContent.classList.toggle('open');
        const arrow = accordionHeader.querySelector('.accordion-arrow');
        if (accordionContent.classList.contains('open')) {
            arrow.style.transform = 'rotate(180deg)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
        }
    });
}

// Запуск
restartGame();