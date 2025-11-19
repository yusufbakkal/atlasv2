// Global değişkenler
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || getDefaultQuizzes();
let currentQuiz = null;
let timer = null;
let startTime = null;
let placedCards = {};
let cardAssignments = {};
let currentEditingQuizId = null;
const uiModalState = {
    container: null,
    titleEl: null,
    messageEl: null,
    confirmBtn: null,
    cancelBtn: null,
    closeBtn: null,
    onConfirm: null,
    showCancel: false
};
const MAP_SOURCE = 'tr.svg';
const categoryStyles = {
    daglar: {
        icon: '⛰️',
        pointColor: '#c2410c',
        lineColor: '#fb923c',
        cardColor: '#f97316',
        bg: 'url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60")'
    },
    platolar: {
        icon: '🏜️',
        pointColor: '#d97706',
        lineColor: '#fb923c',
        cardColor: '#f59e0b',
        bg: 'url("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=60")'
    },
    goller: {
        icon: '💧',
        pointColor: '#0ea5e9',
        lineColor: '#38bdf8',
        cardColor: '#0ea5e9',
        bg: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60")'
    },
    akarsular: {
        icon: '🏞️',
        pointColor: '#2563eb',
        lineColor: '#60a5fa',
        cardColor: '#3b82f6',
        bg: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=60")'
    },
    selaleler: {
        icon: '💦',
        pointColor: '#0ea5e9',
        lineColor: '#38bdf8',
        cardColor: '#0ea5e9',
        bg: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60")'
    },
    ovalar: {
        icon: '🌾',
        pointColor: '#84cc16',
        lineColor: '#a3e635',
        cardColor: '#65a30d',
        bg: 'url("https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=900&q=60")'
    },
    gecitler: {
        icon: '🛣️',
        pointColor: '#6366f1',
        lineColor: '#818cf8',
        cardColor: '#4c51bf',
        bg: 'url("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=60")'
    },
    diger: {
        icon: '📍',
        pointColor: '#4a5568',
        lineColor: '#94a3b8',
        cardColor: '#4a5568',
        bg: 'url("https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=60")'
    }
};
let activeCategoryStyle = categoryStyles.diger;
let locationPickerModal = null;
let pickerMarkersLayer = null;
let pickerMapContainer = null;
let pickerMapImage = null;
let pickerXDisplay = null;
let pickerYDisplay = null;
let activeCoordinateInputs = null;
let pickerSelection = null;

// Varsayılan quiz verileri
function getDefaultQuizzes() {
    return [
        {
            id: 'platolar',
            name: 'Türkiye\'nin Platoları',
            category: 'platolar',
            items: [
                { name: 'Erzurum-Kars Platosu', x: 85, y: 40 },
                { name: 'Doğu Anadolu Platosu', x: 80, y: 45 },
                { name: 'İç Anadolu Platosu', x: 50, y: 45 },
                { name: 'Ardahan Platosu', x: 88, y: 35 },
                { name: 'Uzunyayla Platosu', x: 60, y: 42 }
            ]
        },
        {
            id: 'daglar',
            name: 'Önemli Dağlar',
            category: 'daglar',
            items: [
                { name: 'Ağrı Dağı', x: 90, y: 40 },
                { name: 'Erciyes Dağı', x: 58, y: 47 },
                { name: 'Süphan Dağı', x: 87, y: 42 },
                { name: 'Uludağ', x: 25, y: 40 },
                { name: 'Kaçkar Dağları', x: 83, y: 33 }
            ]
        },
        {
            id: 'goller',
            name: 'Büyük Göller',
            category: 'goller',
            items: [
                { name: 'Van Gölü', x: 88, y: 43 },
                { name: 'Tuz Gölü', x: 50, y: 48 },
                { name: 'Beyşehir Gölü', x: 45, y: 55 },
                { name: 'Eğirdir Gölü', x: 42, y: 56 },
                { name: 'Burdur Gölü', x: 40, y: 58 }
            ]
        },
        {
            id: '1763554905548',
            name: 'sdsds',
            category: 'daglar',
            items: [
                { name: 'df', x: 47.88, y: 27.12 },
                { name: 'f', x: 36.87, y: 37.87 },
                { name: 'a', x: 60.26, y: 45.37 }
            ]
        },
        {
            id: '1763555697984',
            name: 'Delta Ovaları',
            category: 'ovalar',
            items: [
                { name: 'Bafra', x: 53.25, y: 12.12 },
                { name: 'Çarsamba', x: 57.1, y: 17.99 },
                { name: 'Çukurova', x: 50.36, y: 81.89 },
                { name: 'Asi', x: 53.8, y: 89.07 },
                { name: 'Silifke', x: 42.93, y: 87.43 },
                { name: 'Sakarya', x: 26.42, y: 19.29 },
                { name: 'Meriç', x: 7.43, y: 24.51 },
                { name: 'Dikili', x: 10.73, y: 47.66 },
                { name: 'Menemen', x: 10.73, y: 55.48 },
                { name: 'Selçuk', x: 12.52, y: 64.61 },
                { name: 'Balat', x: 12.8, y: 71.46 }
            ]
        }
    ];
}

function initializeMapImages() {
    const mainMap = document.getElementById('turkeyMap');
    if (mainMap) {
        mainMap.setAttribute('src', MAP_SOURCE);
    }
    const pickerMap = document.getElementById('pickerMap');
    if (pickerMap) {
        pickerMap.setAttribute('src', MAP_SOURCE);
    }
}

function setupLocationPicker() {
    locationPickerModal = document.getElementById('locationPicker');
    pickerMarkersLayer = document.getElementById('pickerMarkers');
    pickerMapContainer = document.getElementById('pickerMapContainer');
    pickerMapImage = document.getElementById('pickerMap');
    pickerXDisplay = document.getElementById('pickerXValue');
    pickerYDisplay = document.getElementById('pickerYValue');
    
    const closeBtn = document.getElementById('closeLocationPicker');
    const cancelBtn = document.getElementById('cancelLocation');
    const confirmBtn = document.getElementById('confirmLocation');
    
    if (pickerMapContainer) {
        pickerMapContainer.addEventListener('click', handlePickerMapClick);
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLocationPicker);
    if (cancelBtn) cancelBtn.addEventListener('click', closeLocationPicker);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmLocationSelection);
}

function setupUiMessageModal() {
    uiModalState.container = document.getElementById('uiModal');
    if (!uiModalState.container) return;
    uiModalState.titleEl = document.getElementById('uiModalTitle');
    uiModalState.messageEl = document.getElementById('uiModalMessage');
    uiModalState.confirmBtn = document.getElementById('uiModalConfirm');
    uiModalState.cancelBtn = document.getElementById('uiModalCancel');
    uiModalState.closeBtn = document.getElementById('uiModalClose');

    const handleClose = () => handleUiModalAction(false);
    if (uiModalState.closeBtn) uiModalState.closeBtn.addEventListener('click', handleClose);
    if (uiModalState.cancelBtn) uiModalState.cancelBtn.addEventListener('click', handleClose);
    if (uiModalState.confirmBtn) uiModalState.confirmBtn.addEventListener('click', () => handleUiModalAction(true));
    uiModalState.container.addEventListener('click', (e) => {
        if (e.target === uiModalState.container) {
            handleUiModalAction(false);
        }
    });
}

function openUiModal({ title = 'Bilgi', message = '', showCancel = false, onConfirm = null }) {
    if (!uiModalState.container) return;
    uiModalState.titleEl.textContent = title;
    uiModalState.messageEl.textContent = message;
    uiModalState.onConfirm = onConfirm;
    uiModalState.showCancel = showCancel;
    uiModalState.cancelBtn.style.display = showCancel ? 'inline-flex' : 'none';
    uiModalState.container.style.display = 'block';
}

function handleUiModalAction(confirmed) {
    if (!uiModalState.container) return;
    uiModalState.container.style.display = 'none';
    if (confirmed && typeof uiModalState.onConfirm === 'function') {
        const callback = uiModalState.onConfirm;
        uiModalState.onConfirm = null;
        callback();
    } else {
        uiModalState.onConfirm = null;
    }
}

function showAlertModal(message, title = 'Bilgi', onClose) {
    openUiModal({
        title,
        message,
        showCancel: false,
        onConfirm: onClose || null
    });
}

function showConfirmModal(message, onConfirm, title = 'Onay') {
    openUiModal({
        title,
        message,
        showCancel: true,
        onConfirm
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupLocationPicker();
    setupUiMessageModal();
    initializeMapImages();
    updateAdminQuizList();
    showQuizSelection();
});

// Event Listener'ları kur
function setupEventListeners() {
    // Ana menü butonları
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', showAdminPanel);
    }
    const logoHome = document.getElementById('logoHome');
    if (logoHome) {
        logoHome.addEventListener('click', showQuizSelection);
    }
    
    // Oyun kontrolleri
    document.getElementById('checkAnswers').addEventListener('click', checkAnswers);
    document.getElementById('backToMenu').addEventListener('click', showQuizSelection);
    
    // Sonuç ekranı
    document.getElementById('playAgain').addEventListener('click', () => {
        if (currentQuiz) {
            startQuiz(currentQuiz.id);
        }
    });
    document.getElementById('backToMenuResult').addEventListener('click', showQuizSelection);
    
    // Admin panel
    const adminCloseBtn = document.querySelector('#adminPanel .close');
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', hideAdminPanel);
    }
    document.getElementById('addQuizBtn').addEventListener('click', () => showQuizForm());
    document.getElementById('cancelQuizForm').addEventListener('click', hideQuizForm);
    document.getElementById('addQuizForm').addEventListener('submit', saveNewQuiz);
    document.getElementById('addItemBtn').addEventListener('click', addQuizItem);
    
    // Modal dışına tıklama
    window.addEventListener('click', (e) => {
        if (e.target.id === 'adminPanel') {
            hideAdminPanel();
        }
        if (e.target.id === 'locationPicker') {
            closeLocationPicker();
        }
    });
    
    window.addEventListener('resize', () => {
        updateConnectorDimensions();
    });
}

// Quiz seçim ekranını göster
function showQuizSelection() {
    hideAllScreens();
    document.getElementById('quizSelection').classList.add('active');
    displayQuizList();
    stopTimer();
}

// Quiz listesini göster
function displayQuizList() {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '';
    
    quizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        const style = getCategoryStyle(quiz.category);
        const categoryName = getCategoryName(quiz.category);
        const bgImage = style.bg || 'url("https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=60")';
        card.style.setProperty('--card-bg', bgImage);
        card.dataset.category = quiz.category;
        card.innerHTML = `
            <div class="quiz-card-content">
                <div class="quiz-card-icon">${style.icon || '🗺️'}</div>
                <h3>${quiz.name}</h3>
                <p>${quiz.items.length} konum</p>
                <div class="quiz-card-footer">
                    <span>${categoryName}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => startQuiz(quiz.id));
        quizList.appendChild(card);
    });
}

// Quiz'i başlat
function startQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;
    activeCategoryStyle = getCategoryStyle(currentQuiz.category);
    
    placedCards = {};
    cardAssignments = {};
    hideAllScreens();
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('quizTitle').textContent = currentQuiz.name;
    const categoryLabelEl = document.getElementById('quizCategoryLabel');
    if (categoryLabelEl) {
        const categoryName = getCategoryName(currentQuiz.category);
        const icon = activeCategoryStyle.icon || '';
        categoryLabelEl.innerHTML = `
            <span class="quiz-category-icon">${icon}</span>
            <span>${categoryName}</span>
        `;
        categoryLabelEl.style.borderColor = activeCategoryStyle.pointColor;
        categoryLabelEl.style.color = activeCategoryStyle.pointColor;
    }
    
    setupMap();
    setupCards();
    startTimer();
}

// Haritayı hazırla
function setupMap() {
    const mapPoints = document.getElementById('mapPoints');
    mapPoints.innerHTML = '';
    const globalConnectorLayer = document.getElementById('globalConnectorLayer');
    if (globalConnectorLayer) {
        globalConnectorLayer.innerHTML = '';
        updateConnectorDimensions();
    }
    document.querySelectorAll('.map-connection-label').forEach(label => label.remove());
    
    const turkeyMap = document.getElementById('turkeyMap');
    if (turkeyMap && turkeyMap.getAttribute('src') !== MAP_SOURCE) {
        turkeyMap.setAttribute('src', MAP_SOURCE);
    }
    
    // Noktaları ekle
    currentQuiz.items.forEach((item, index) => {
        const point = document.createElement('div');
        point.className = 'map-point';
        point.dataset.index = index;
        point.style.left = `${item.x}%`;
        point.style.top = `${item.y}%`;
        point.title = item.name;
        
        const style = activeCategoryStyle || getCategoryStyle(currentQuiz.category);
        point.style.background = style.pointColor;
        const icon = document.createElement('span');
        icon.className = 'point-icon';
        icon.textContent = style.icon;
        point.appendChild(icon);
        
        // Sürükle-bırak için drop zone
        point.addEventListener('dragover', handleDragOver);
        point.addEventListener('drop', handleDrop);
        point.addEventListener('dragleave', handleDragLeave);
        
        mapPoints.appendChild(point);
    });
}

// Kartları hazırla
function setupCards() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';
    
    // Kartları karıştır
    const shuffledItems = [...currentQuiz.items].sort(() => Math.random() - 0.5);
    const style = activeCategoryStyle || getCategoryStyle(currentQuiz.category);
    const baseColor = style.cardColor || style.lineColor || '#5a67d8';
    
    shuffledItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = item.name;
        card.draggable = true;
        card.dataset.name = item.name;
        const color = lightenColor(baseColor, index * 0.08);
        card.dataset.color = color;
        card.style.borderColor = color;
        card.style.boxShadow = `0 6px 18px ${hexToRgba(color, 0.35)}`;
        card.style.background = '#fff';
        
        // Sürükle-bırak eventleri
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        // Mobil (touch) desteği
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);
        
        cardsList.appendChild(card);
    });
}

// Sürükle-bırak fonksiyonları
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.currentTarget;
    draggedElement.classList.add('dragging');
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

// Mobil dokunma ile sürükle-bırak benzeri davranış
function handleTouchStart(e) {
    const target = e.currentTarget;
    draggedElement = target;
    target.classList.add('dragging');
}

function handleTouchEnd(e) {
    if (!draggedElement) return;
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const mapPoint = element && element.closest ? element.closest('.map-point') : null;

    if (mapPoint) {
        assignCardToPoint(mapPoint, draggedElement);
    }

    draggedElement.classList.remove('dragging');
    draggedElement = null;
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedElement) {
        assignCardToPoint(e.currentTarget, draggedElement);
    }
}

function assignCardToPoint(mapPoint, cardEl) {
    const pointIndex = parseInt(mapPoint.dataset.index, 10);
    const cardName = cardEl.dataset.name;
    const cardColor = cardEl.dataset.color || '#5a67d8';

    // Eski atamayı (aynı kartın daha önce bağlandığı noktayı) temizle
    const previousPointIndex = cardAssignments[cardName];
    if (previousPointIndex !== undefined && previousPointIndex !== pointIndex) {
        delete placedCards[previousPointIndex];
        const prevPoint = document.querySelector(`.map-point[data-index="${previousPointIndex}"]`);
        if (prevPoint) {
            prevPoint.dataset.occupied = '';
            prevPoint.classList.remove('occupied', 'correct', 'wrong');
        }
        const prevLabel = document.querySelector(`.map-connection-label[data-index="${previousPointIndex}"]`);
        if (prevLabel) prevLabel.remove();
        cardEl.classList.remove('linked');
    }

    // Yeni nokta daha önce başka bir kartla doluysa o kartın kaydını temizle
    const oldCardAtNewPoint = placedCards[pointIndex];
    if (oldCardAtNewPoint && oldCardAtNewPoint !== cardName) {
        delete cardAssignments[oldCardAtNewPoint];
        const oldLabel = document.querySelector(`.map-connection-label[data-index="${pointIndex}"]`);
        if (oldLabel) oldLabel.remove();
        const oldCardEl = Array.from(document.querySelectorAll('.card')).find(card => card.dataset.name === oldCardAtNewPoint);
        if (oldCardEl) {
            oldCardEl.classList.remove('linked');
        }
    }

    // Yeni eşleşmeyi kaydet
    placedCards[pointIndex] = cardName;
    cardAssignments[cardName] = pointIndex;
    mapPoint.dataset.occupied = 'true';
    mapPoint.classList.add('occupied');
    mapPoint.classList.remove('correct', 'wrong');

    // Kart bağlandı bilgisini görsel olarak göster (soluklaşma animasyonu)
    cardEl.classList.add('linked');

    createConnection(pointIndex, cardName, cardColor);
}

function createConnection(pointIndex, labelText, color) {
    const mapPointsLayer = document.getElementById('mapPoints');
    const item = currentQuiz.items[pointIndex];
    if (mapPointsLayer && item) {
        const existingLabel = mapPointsLayer.querySelector(`.map-connection-label[data-index="${pointIndex}"]`);
        if (existingLabel) existingLabel.remove();
        const label = document.createElement('div');
        label.className = 'map-connection-label';
        label.dataset.index = pointIndex;
        const content = document.createElement('span');
        content.textContent = labelText;
        label.appendChild(content);
        label.style.left = `calc(${item.x}% + 18px)`;
        label.style.top = `${item.y}%`;
        label.style.border = `2px solid ${color}`;
        mapPointsLayer.appendChild(label);
    }
}

// Cevapları kontrol et
function checkAnswers() {
    stopTimer();
    
    let correct = 0;
    let wrong = 0;
    const results = [];
    
    currentQuiz.items.forEach((item, index) => {
        const placedCard = placedCards[index];
        const mapPoint = document.querySelector(`.map-point[data-index="${index}"]`);
        
        if (placedCard === item.name) {
            correct++;
            mapPoint.classList.add('correct');
            mapPoint.classList.remove('wrong');
            results.push({ name: item.name, status: 'correct', placed: placedCard });
        } else {
            wrong++;
            mapPoint.classList.add('wrong');
            mapPoint.classList.remove('correct');
            results.push({ 
                name: item.name, 
                status: 'wrong', 
                placed: placedCard || 'Yerleştirilmedi' 
            });
        }
    });
    
    showResults(correct, wrong, results);
}

// Sonuçları göster
function showResults(correct, wrong, results) {
    hideAllScreens();
    document.getElementById('resultScreen').classList.add('active');
    
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;
    document.getElementById('totalTime').textContent = document.getElementById('timer').textContent;
    
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.innerHTML = '';
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = `result-item ${result.status}`;
        item.innerHTML = `
            <span><strong>${result.name}</strong></span>
            <span>${result.status === 'correct' ? '✓ Doğru' : `✗ Yanlış (${result.placed})`}</span>
        `;
        resultDetails.appendChild(item);
    });
}

// Timer fonksiyonları
function startTimer() {
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Admin panel fonksiyonları
function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
}

function hideAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    hideQuizForm();
    closeLocationPicker();
}

function showQuizForm(quizToEdit = null) {
    const formWrapper = document.getElementById('quizForm');
    const formTitle = formWrapper.querySelector('h3');
    const submitBtn = document.querySelector('#addQuizForm button[type="submit"]');
    const formElement = document.getElementById('addQuizForm');
    const itemsList = document.getElementById('itemsList');
    
    currentEditingQuizId = quizToEdit ? quizToEdit.id : null;
    formWrapper.style.display = 'block';
    itemsList.innerHTML = '';
    
    if (quizToEdit) {
        formTitle.textContent = 'Quiz Düzenle';
        submitBtn.textContent = 'Güncelle';
        document.getElementById('quizName').value = quizToEdit.name;
        document.getElementById('quizCategory').value = quizToEdit.category;
        quizToEdit.items.forEach(item => addQuizItem(item));
    } else {
        formTitle.textContent = 'Yeni Quiz Ekle';
        submitBtn.textContent = 'Kaydet';
        formElement.reset();
        addQuizItem();
    }
    
    renderPickerMarkers();
}

function hideQuizForm() {
    document.getElementById('quizForm').style.display = 'none';
    document.getElementById('addQuizForm').reset();
    currentEditingQuizId = null;
    renderPickerMarkers();
}

function addQuizItem(itemData = null) {
    const itemsList = document.getElementById('itemsList');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'quiz-item';
    itemDiv.innerHTML = `
        <input type="text" class="item-name" placeholder="Öğe adı" required>
        <input type="number" class="coord-input coord-x" placeholder="X (%)" min="0" max="100" step="0.01" required>
        <input type="number" class="coord-input coord-y" placeholder="Y (%)" min="0" max="100" step="0.01" required>
        <button type="button" class="btn btn-small btn-outline select-location">Konum Seç</button>
        <button type="button" class="remove-item">Sil</button>
    `;
    itemsList.appendChild(itemDiv);
    
    const nameInput = itemDiv.querySelector('.item-name');
    const xInput = itemDiv.querySelector('.coord-x');
    const yInput = itemDiv.querySelector('.coord-y');
    const selectBtn = itemDiv.querySelector('.select-location');
    const removeBtn = itemDiv.querySelector('.remove-item');

    if (itemData) {
        nameInput.value = itemData.name || '';
        if (typeof itemData.x === 'number') {
            xInput.value = clampCoordinate(itemData.x).toFixed(2);
        }
        if (typeof itemData.y === 'number') {
            yInput.value = clampCoordinate(itemData.y).toFixed(2);
        }
    }
    
    if (selectBtn) {
        selectBtn.addEventListener('click', () => openLocationPicker(xInput, yInput));
    }
    [xInput, yInput].forEach(input => {
        input.addEventListener('input', renderPickerMarkers);
    });
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            itemDiv.remove();
            renderPickerMarkers();
        });
    }
    renderPickerMarkers();
}

function openLocationPicker(xInput, yInput) {
    activeCoordinateInputs = { xInput, yInput };
    const currentX = parseFloat(xInput?.value);
    const currentY = parseFloat(yInput?.value);
    
    if (!isNaN(currentX) && !isNaN(currentY)) {
        pickerSelection = {
            x: clampCoordinate(currentX),
            y: clampCoordinate(currentY)
        };
    } else {
        pickerSelection = null;
    }
    
    if (locationPickerModal) {
        locationPickerModal.style.display = 'block';
    }
    updatePickerMarker();
}

function closeLocationPicker() {
    if (locationPickerModal) {
        locationPickerModal.style.display = 'none';
    }
    activeCoordinateInputs = null;
    pickerSelection = null;
    updatePickerMarker();
}

function handlePickerMapClick(e) {
    if (!pickerMapImage) return;
    const rect = pickerMapImage.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    pickerSelection = {
        x: clampCoordinate(xPercent),
        y: clampCoordinate(yPercent)
    };
    updatePickerMarker();
}

function updatePickerMarker() {
    if (!pickerXDisplay || !pickerYDisplay) return;
    
    if (pickerSelection) {
        pickerXDisplay.textContent = pickerSelection.x.toFixed(1);
        pickerYDisplay.textContent = pickerSelection.y.toFixed(1);
    } else {
        pickerXDisplay.textContent = '-';
        pickerYDisplay.textContent = '-';
    }
    renderPickerMarkers();
}

function renderPickerMarkers() {
    if (!pickerMarkersLayer) return;
    pickerMarkersLayer.innerHTML = '';
    
    const quizItems = document.querySelectorAll('.quiz-item');
    quizItems.forEach(itemDiv => {
        const nameInput = itemDiv.querySelector('.item-name');
        const xInput = itemDiv.querySelector('.coord-x');
        const yInput = itemDiv.querySelector('.coord-y');
        const xVal = parseFloat(xInput?.value);
        const yVal = parseFloat(yInput?.value);
        if (!isNaN(xVal) && !isNaN(yVal)) {
            const marker = document.createElement('div');
            marker.className = 'picker-marker';
            if (activeCoordinateInputs && activeCoordinateInputs.xInput === xInput && activeCoordinateInputs.yInput === yInput) {
                marker.classList.add('active');
            }
            marker.style.left = `${clampCoordinate(xVal)}%`;
            marker.style.top = `${clampCoordinate(yVal)}%`;
            pickerMarkersLayer.appendChild(marker);

            const labelText = nameInput?.value?.trim();
            if (labelText) {
                const label = document.createElement('div');
                label.className = 'picker-label';
                if (marker.classList.contains('active')) {
                    label.classList.add('active');
                }
                label.style.left = `${clampCoordinate(xVal)}%`;
                label.style.top = `${clampCoordinate(yVal)}%`;
                const span = document.createElement('span');
                span.textContent = labelText;
                label.appendChild(span);
                pickerMarkersLayer.appendChild(label);
            }
        }
    });
    
    if (pickerSelection) {
        let shouldShowTemp = true;
        if (activeCoordinateInputs) {
            const currentX = parseFloat(activeCoordinateInputs.xInput.value);
            const currentY = parseFloat(activeCoordinateInputs.yInput.value);
            if (!isNaN(currentX) && !isNaN(currentY)) {
                if (Math.abs(currentX - pickerSelection.x) <= 0.05 && Math.abs(currentY - pickerSelection.y) <= 0.05) {
                    shouldShowTemp = false;
                }
            }
        }
        if (shouldShowTemp) {
            const tempMarker = document.createElement('div');
            tempMarker.className = 'picker-marker temp';
            tempMarker.style.left = `${pickerSelection.x}%`;
            tempMarker.style.top = `${pickerSelection.y}%`;
            pickerMarkersLayer.appendChild(tempMarker);

            const tempLabel = document.createElement('div');
            tempLabel.className = 'picker-label temp';
            tempLabel.style.left = `${pickerSelection.x}%`;
            tempLabel.style.top = `${pickerSelection.y}%`;
            const span = document.createElement('span');
            const activeNameInput = activeCoordinateInputs?.xInput?.closest('.quiz-item')?.querySelector('.item-name');
            span.textContent = activeNameInput?.value?.trim() || 'Yeni Nokta';
            tempLabel.appendChild(span);
            pickerMarkersLayer.appendChild(tempLabel);
        }
    }
}

function confirmLocationSelection() {
    if (!pickerSelection || !activeCoordinateInputs) {
        showAlertModal('Lütfen haritada bir konum seçin.');
        return;
    }
    
    const normalizedX = normalizeCoordinate(pickerSelection.x);
    const normalizedY = normalizeCoordinate(pickerSelection.y);
    activeCoordinateInputs.xInput.value = normalizedX.toFixed(2);
    activeCoordinateInputs.yInput.value = normalizedY.toFixed(2);
    closeLocationPicker();
}

function saveNewQuiz(e) {
    e.preventDefault();
    
    const name = document.getElementById('quizName').value;
    const category = document.getElementById('quizCategory').value;
    const items = [];
    
    document.querySelectorAll('.quiz-item').forEach(itemDiv => {
        const nameInput = itemDiv.querySelector('.item-name');
        const xInput = itemDiv.querySelector('.coord-x');
        const yInput = itemDiv.querySelector('.coord-y');
        const nameValue = nameInput?.value?.trim();
        const xValue = parseFloat(xInput?.value);
        const yValue = parseFloat(yInput?.value);
        
        if (nameValue && !isNaN(xValue) && !isNaN(yValue)) {
            const sanitizedX = normalizeCoordinate(xValue);
            const sanitizedY = normalizeCoordinate(yValue);
            items.push({
                name: nameValue,
                x: sanitizedX,
                y: sanitizedY
            });
        }
    });
    
    if (items.length === 0) {
        showAlertModal('En az bir öğe eklemelisiniz!');
        return;
    }
    
    if (currentEditingQuizId) {
        const quizIndex = quizzes.findIndex(q => q.id === currentEditingQuizId);
        if (quizIndex !== -1) {
            quizzes[quizIndex] = {
                ...quizzes[quizIndex],
                name,
                category,
                items
            };
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            showAlertModal('Quiz başarıyla güncellendi!');
        }
    } else {
        const newQuiz = {
            id: Date.now().toString(),
            name,
            category,
            items
        };
        quizzes.push(newQuiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        showAlertModal('Quiz başarıyla eklendi!');
    }
    
    hideQuizForm();
    updateAdminQuizList();
    displayQuizList();
}

function updateAdminQuizList() {
    const adminQuizList = document.getElementById('adminQuizList');
    adminQuizList.innerHTML = '<h3>Mevcut Quizler</h3>';
    
    quizzes.forEach(quiz => {
        const item = document.createElement('div');
        item.className = 'admin-quiz-item';
        item.innerHTML = `
            <div>
                <h4>${quiz.name}</h4>
                <small>${quiz.items.length} öğe - ${getCategoryName(quiz.category)}</small>
            </div>
            <div class="admin-quiz-actions">
                <button class="btn btn-small btn-secondary" onclick="editQuiz('${quiz.id}')">Düzenle</button>
                <button class="btn btn-small" style="background: #f56565; color: white;" 
                        onclick="deleteQuiz('${quiz.id}')">Sil</button>
            </div>
        `;
        adminQuizList.appendChild(item);
    });
}

function deleteQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    const quizName = quiz ? quiz.name : 'Bu';
    showConfirmModal(`"${quizName}" quiz'ini silmek istediğinize emin misiniz?`, () => {
        quizzes = quizzes.filter(q => q.id !== quizId);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        updateAdminQuizList();
        displayQuizList();
    });
}

function editQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) {
        showAlertModal('Quiz bulunamadı.');
        return;
    }
    showQuizForm(quiz);
}

// Yardımcı fonksiyonlar
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function clampCoordinate(value) {
    const numeric = Number(value);
    if (isNaN(numeric)) return 0;
    return Math.min(Math.max(numeric, 0), 100);
}

function normalizeCoordinate(value) {
    return Math.round(clampCoordinate(value) * 100) / 100;
}

function updateConnectorDimensions() {
    const connectorLayer = document.getElementById('globalConnectorLayer');
    const gameArea = document.getElementById('gameArea');
    if (!connectorLayer || !gameArea) return;
    const rect = gameArea.getBoundingClientRect();
    connectorLayer.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    connectorLayer.setAttribute('width', rect.width);
    connectorLayer.setAttribute('height', rect.height);
}

function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(90, 103, 216, ${alpha})`;
    let sanitized = hex.replace('#', '');
    if (sanitized.length === 3) {
        sanitized = sanitized.split('').map(c => c + c).join('');
    }
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lightenColor(hex, factor = 0.1) {
    if (!hex) return '#5a67d8';
    let sanitized = hex.replace('#', '');
    if (sanitized.length === 3) {
        sanitized = sanitized.split('').map(c => c + c).join('');
    }
    const num = parseInt(sanitized, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.min(255, Math.floor(g + (255 - g) * factor));
    b = Math.min(255, Math.floor(b + (255 - b) * factor));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getCategoryName(category) {
    const categories = {
        'daglar': 'Dağlar',
        'ovalar': 'Ovalar',
        'goller': 'Göller',
        'akarsular': 'Akarsular',
        'selaleler': 'Şelaleler',
        'platolar': 'Platolar',
        'gecitler': 'Geçitler',
        'diger': 'Diğer'
    };
    return categories[category] || category;
}

function getCategoryStyle(category) {
    return categoryStyles[category] || categoryStyles.diger;
}
