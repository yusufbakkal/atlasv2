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
    'tarim-urunleri': {
        icon: '🌾',
        pointColor: '#16a34a',
        lineColor: '#4ade80',
        cardColor: '#22c55e',
        bg: 'url("https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=60")'
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
let cityPickerModal = null;
let cityPickerMapContainer = null;
let selectedCityName = null;
let activeCityInput = null;
let cityPickerCityNameDisplay = null;

// Varsayılan quiz verileri
function getDefaultQuizzes() {
    return [
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
        },
        {
            id: '1763556481883',
            name: 'Kırık Dağlar',
            category: 'daglar',
            items: [
                { name: 'Kaz', x: 9.49, y: 38.2 },
                { name: 'Madra', x: 11.56, y: 44.07 },
                { name: 'Yunt', x: 11.97, y: 51.57 },
                { name: 'Bozdağlar', x: 14.17, y: 58.42 },
                { name: 'Aydın', x: 14.31, y: 68.52 },
                { name: 'Menteşe', x: 17.47, y: 76.02 },
                { name: 'Amanos(Nur)', x: 55.45, y: 80.91 }
            ]
        },
        {
            id: '1763556772743',
            name: 'Karstik Platolar',
            category: 'platolar',
            items: [
                { name: 'Teke', x: 25.45, y: 84.83 },
                { name: 'Taşeli', x: 42.38, y: 86.78 }
            ]
        },
        {
            id: '1763557089167',
            name: 'Volkanik Dağlar',
            category: 'daglar',
            items: [
                { name: 'Kula', x: 17.34, y: 54.18 },
                { name: 'Hasan', x: 43.75, y: 56.13 },
                { name: 'Karadağ', x: 38.94, y: 70.15 },
                { name: 'Karacadağ', x: 42.93, y: 65.26 },
                { name: 'Melendiz', x: 46.64, y: 58.09 },
                { name: 'Erciyes', x: 52.7, y: 50.26 },
                { name: 'Karacadağ(Doğu)', x: 72.51, y: 62.33 },
                { name: 'Nemrut', x: 80.76, y: 51.9 },
                { name: 'Süphan', x: 84.2, y: 46.68 },
                { name: 'Tendürek', x: 87.37, y: 42.77 },
                { name: 'Ağrı', x: 91.91, y: 38.85 }
            ]
        },
        {
            id: '1763557213635',
            name: 'Volkanik Platolar',
            category: 'daglar',
            items: [
                { name: 'Kırşehir', x: 44.85, y: 45.37 },
                { name: 'Kapadokya', x: 47.47, y: 55.48 },
                { name: 'Ardahan(Yazılıkaya)', x: 85.31, y: 22.22 },
                { name: 'Erzurum-Kars', x: 82.83, y: 33.31 }
            ]
        },
        {
            id: '1763557301070',
            name: 'Aşınım Platolar',
            category: 'platolar',
            items: [
                { name: 'Çatalca-Kocaeli', x: 21, y: 19.54 },
                { name: 'Perşembe', x: 60.35, y: 23.45 }
            ]
        },
        {
            id: '1763557515610',
            name: 'Tabaka Düzlüğü Platolar',
            category: 'daglar',
            items: [
                { name: 'Yazılıkaya', x: 28.29, y: 48.23 },
                { name: 'Haymana', x: 37.23, y: 36.82 },
                { name: 'Obruk', x: 37.92, y: 69.1 },
                { name: 'Bozok', x: 50.99, y: 37.8 },
                { name: 'Uzunyayla', x: 63.92, y: 48.23 },
                { name: 'Gaziantep', x: 60.62, y: 79.53 },
                { name: 'Şanlıurfa', x: 68.74, y: 75.95 },
                { name: 'Cihanbeyli', x: 37.37, y: 58.34 }
            ]
        },
        {
            id: '1763557788895',
            name: 'Başlıca Şelaleler',
            category: 'selaleler',
            items: [
                { name: 'Samandere', x: 30.21, y: 23.45 },
                { name: 'Ilıca', x: 40.95, y: 12.69 },
                { name: 'Erfelek', x: 48.93, y: 9.1 },
                { name: 'Gelintülü', x: 75.76, y: 25.08 },
                { name: 'Bulut', x: 77.41, y: 19.86 },
                { name: 'Tortum', x: 79.2, y: 32.58 },
                { name: 'Muradiye', x: 88.55, y: 49.54 },
                { name: 'Girlevik', x: 70.25, y: 40.41 },
                { name: 'Kapuzbaşı', x: 51.54, y: 54.75 },
                { name: 'Gürpınar', x: 64.47, y: 52.14 },
                { name: 'Kurşunlu', x: 26.64, y: 77.9 },
                { name: 'Düden', x: 26.36, y: 84.75 },
                { name: 'Manavgat', x: 35.58, y: 84.75 },
                { name: 'Yerköprü', x: 44.39, y: 81.81 }
            ]
        },
        {
            id: '1763561284849',
            name: 'Kıyı Set Gölleri',
            category: 'goller',
            items: [
                { name: 'Balık', x: 53.19, y: 12.69 },
                { name: 'Terkos', x: 20.45, y: 16.93 },
                { name: 'K. Çekmece', x: 21.27, y: 22.47 },
                { name: 'B. Çekmece', x: 19.07, y: 20.84 },
                { name: 'Akyatan', x: 50.58, y: 83.12 },
                { name: 'Ağyatan', x: 52.78, y: 80.18 }
            ]
        },
        {
            id: '1763561456369',
            name: 'Alüvyal Set Gölleri',
            category: 'goller',
            items: [
                { name: 'Eymir', x: 37.78, y: 32.58 },
                { name: 'Mogan', x: 36.96, y: 42.36 },
                { name: 'Gala', x: 8.06, y: 23.78 },
                { name: 'Marmara', x: 17.01, y: 54.75 },
                { name: 'Bafa', x: 14.12, y: 72.03 },
                { name: 'Köyceğiz', x: 19.48, y: 80.84 }
            ]
        },
        {
            id: '1763561706964',
            name: 'Volkanik Set Gölleri',
            category: 'goller',
            items: [
                { name: 'Çıldır', x: 87.31, y: 20.84 },
                { name: 'Balık', x: 87.18, y: 38.78 },
                { name: 'Van', x: 89.38, y: 53.45 },
                { name: 'Haçlı', x: 81.12, y: 49.86 },
                { name: 'Nazik', x: 82.36, y: 58.66 },
                { name: 'Erçek', x: 89.93, y: 60.95 }
            ]
        },
        {
            id: '1763561919920',
            name: 'Heyelan Set Gölleri',
            category: 'goller',
            items: [
                { name: 'Yedigöller', x: 34.07, y: 23.45 },
                { name: 'Abant', x: 32.14, y: 28.99 },
                { name: 'Borabay', x: 51.4, y: 24.1 },
                { name: 'Zinav', x: 56.91, y: 30.3 },
                { name: 'Tortum', x: 80.71, y: 30.62 }
            ]
        },
        {
            id: '1763562210632',
            name: 'Volkanik Göller',
            category: 'goller',
            items: [
                { name: 'Acıgöl Maar Gölü', x: 47.69, y: 51.82 },
                { name: 'Meke Maar Gölü', x: 38.88, y: 66.49 },
                { name: 'Nemrut Krater Gölü', x: 84.42, y: 56.06 }
            ]
        },
        {
            id: '1763562436132',
            name: 'Karstik Göller',
            category: 'goller',
            items: [
                { name: 'Hafik', x: 59.8, y: 41.71 },
                { name: 'Suğla', x: 35.31, y: 69.42 },
                { name: 'Salda', x: 25.12, y: 72.69 },
                { name: 'Avlan', x: 25.26, y: 85.4 },
                { name: 'Kestel', x: 27.6, y: 72.03 }
            ]
        },
        {
            id: '1764345925228',
            name: 'Tarım Ürünleri',
            category: 'tarim-urunleri',
            items: [
                { name: 'Çay', city: 'Rize' },
                { name: 'Fındık', city: 'Ordu' },
                { name: 'Kayısı', city: 'Malatya' },
                { name: 'Kenevir', city: 'Kastamonu' },
                { name: 'Ayçiçeği', city: 'Tekirdağ' },
                { name: 'Pirinç', city: 'Edirne' },
                { name: 'Buğday', city: 'Konya' },
                { name: 'Kivi', city: 'Bursa' },
                { name: 'Keten', city: 'Uşak' },
                { name: 'Kanola-Kolza', city: 'Tekirdağ' },
                { name: 'Zeytin', city: 'Manisa' },
                { name: 'Üzüm', city: 'Manisa' },
                { name: 'Haşhaş', city: 'Afyonkarahisar' },
                { name: 'Tütün', city: 'Adıyaman' },
                { name: 'İncir', city: 'Aydın' },
                { name: 'Susam', city: 'Antalya' },
                { name: 'Gül', city: 'Isparta' },
                { name: 'Muz', city: 'Antalya' },
                { name: 'Yer Fıstığı', city: 'Adana' },
                { name: 'Soya Fasulyesi', city: 'Adana' },
                { name: 'Elma', city: 'Isparta' },
                { name: 'Anason', city: 'Burdur' },
                { name: 'Mandalina', city: 'Adana' },
                { name: 'Limon', city: 'Mersin' },
                { name: 'Portakal', city: 'Antalya' },
                { name: 'Greyfurt', city: 'Adana' },
                { name: 'Kırmızı Mercimek', city: 'Şanlıurfa' },
                { name: 'Antep Fıstığı', city: 'Şanlıurfa' },
                { name: 'Pamuk', city: 'Şanlıurfa' },
                { name: 'Arpa', city: 'Konya' },
                { name: 'Şeker Pancarı', city: 'Konya' },
                { name: 'Aspir', city: 'Kayseri' },
                { name: 'Patates', city: 'Niğde' },
                { name: 'Fasulye', city: 'Konya' },
                { name: 'Mercimek', city: 'Yozgat' },
                { name: 'Nohut', city: 'Ankara' },
                { name: 'Mısır', city: 'Konya' }
            ]
        },
        {
            id: '1764602578421',
            name: 'Hayvancılık',
            category: 'tarim-urunleri',
            items: [
                { name: 'Sığır', city: 'Konya' },
                { name: 'Manda', city: 'Samsun' },
                { name: 'Koyun', city: 'Van' },
                { name: 'Kıl Keçisi', city: 'Mersin' },
                { name: 'Tiftik Keçisi', city: 'Ankara' },
                { name: 'Arıcılık', city: 'Ordu' },
                { name: 'İpek Böceği', city: 'Diyarbakır' },
                { name: 'Kümes', city: 'Manisa' }
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

function setupCityPicker() {
    cityPickerModal = document.getElementById('cityPicker');
    cityPickerMapContainer = document.getElementById('cityPickerMapContainer');
    cityPickerCityNameDisplay = document.getElementById('selectedCityName');
    
    const closeBtn = document.getElementById('closeCityPicker');
    const cancelBtn = document.getElementById('cancelCity');
    const confirmBtn = document.getElementById('confirmCity');
    
    if (closeBtn) closeBtn.addEventListener('click', closeCityPicker);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCityPicker);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmCitySelection);
    
    loadCityPickerMap();
}

function loadCityPickerMap() {
    if (!cityPickerMapContainer) return;
    
    fetch('harita/map.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const svgElement = doc.querySelector('#svg-turkey-map');
            if (svgElement) {
                cityPickerMapContainer.innerHTML = '';
                cityPickerMapContainer.appendChild(svgElement.cloneNode(true));
                const cityNameDisplay = document.createElement('div');
                cityNameDisplay.id = 'city-name';
                cityNameDisplay.className = 'show-city-name';
                cityPickerMapContainer.appendChild(cityNameDisplay);
                
                const svg = cityPickerMapContainer.querySelector('#svg-turkey-map');
                if (svg) {
                    const paths = svg.querySelectorAll('path.city');
                    paths.forEach(path => {
                        const handleCityClick = function() {
                            const cityName = this.getAttribute('title');
                            selectedCityName = cityName;
                            if (cityPickerCityNameDisplay) {
                                cityPickerCityNameDisplay.textContent = cityName;
                            }
                            paths.forEach(p => p.style.fill = '#CCCCCC');
                            this.style.fill = '#16a34a';
                        };
                        path.addEventListener('click', handleCityClick);
                        path.addEventListener('touchend', function(e) {
                            e.preventDefault();
                            handleCityClick.call(this);
                        }, { passive: false });
                        path.addEventListener('mousemove', function(e) {
                            const cityNameEl = cityPickerMapContainer.querySelector('#city-name');
                            if (cityNameEl) {
                                cityNameEl.classList.add('show-city-name--active');
                                // Harita container'ına göre konumlandır
                                const rect = cityPickerMapContainer.getBoundingClientRect();
                                cityNameEl.style.left = (e.clientX - rect.left + 15) + 'px';
                                cityNameEl.style.top = (e.clientY - rect.top - 50) + 'px';
                                cityNameEl.textContent = this.getAttribute('title');
                            }
                        });
                        path.addEventListener('mouseleave', function() {
                            const cityNameEl = cityPickerMapContainer.querySelector('#city-name');
                            if (cityNameEl) {
                                cityNameEl.classList.remove('show-city-name--active');
                            }
                        });
                    });
                }
            }
        })
        .catch(error => {
            console.error('Harita yüklenirken hata:', error);
        });
}

function openCityPicker(cityInput) {
    activeCityInput = cityInput;
    selectedCityName = cityInput?.value?.trim() || null;
    
    if (cityPickerModal) {
        cityPickerModal.style.display = 'block';
    }
    if (cityPickerCityNameDisplay) {
        cityPickerCityNameDisplay.textContent = selectedCityName || '-';
    }
    
    if (cityPickerMapContainer) {
        const svg = cityPickerMapContainer.querySelector('#svg-turkey-map');
        if (svg) {
            const paths = svg.querySelectorAll('path.city');
            paths.forEach(path => {
                path.style.fill = '#CCCCCC';
                if (selectedCityName && path.getAttribute('title') === selectedCityName) {
                    path.style.fill = '#16a34a';
                }
            });
        }
    }
}

function closeCityPicker() {
    if (cityPickerModal) {
        cityPickerModal.style.display = 'none';
    }
    activeCityInput = null;
    selectedCityName = null;
}

function confirmCitySelection() {
    if (activeCityInput && selectedCityName) {
        activeCityInput.value = selectedCityName;
    }
    closeCityPicker();
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
    setupCityPicker();
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
    
    const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
    if (closeCategoryModalBtn) {
        closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
    }
    
    // Modal dışına tıklama
    window.addEventListener('click', (e) => {
        if (e.target.id === 'adminPanel') {
            hideAdminPanel();
        }
        if (e.target.id === 'locationPicker') {
            closeLocationPicker();
        }
        if (e.target.id === 'cityPicker') {
            closeCityPicker();
        }
        if (e.target.id === 'categoryQuizModal') {
            closeCategoryModal();
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
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    categoryList.innerHTML = '';
    
    // Kategorilere göre ayır
    const tarimUrunleriQuizzes = quizzes.filter(q => q.category === 'tarim-urunleri');
    const yerSekilleriQuizzes = quizzes.filter(q => q.category !== 'tarim-urunleri');
    
    // Yer Şekilleri Kategorisi
    if (yerSekilleriQuizzes.length > 0) {
        const categoryCard = createCategoryCard('Yer Şekilleri', '🗺️', yerSekilleriQuizzes.length, yerSekilleriQuizzes);
        categoryList.appendChild(categoryCard);
    }
    
    // Tarım Ürünleri Kategorisi
    if (tarimUrunleriQuizzes.length > 0) {
        const categoryCard = createCategoryCard('Tarım Ürünleri', '🌾', tarimUrunleriQuizzes.length, tarimUrunleriQuizzes);
        categoryList.appendChild(categoryCard);
    }
}

function createCategoryCard(title, icon, count, quizzes) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
        <div class="category-card-icon">${icon}</div>
        <div class="category-card-content">
            <h3 class="category-card-title">${title}</h3>
            <p class="category-card-count">${count} quiz</p>
        </div>
        <div class="category-card-arrow">→</div>
    `;
    
    card.addEventListener('click', () => {
        openCategoryModal(title, icon, quizzes);
    });
    
    return card;
}

function openCategoryModal(title, icon, quizzes) {
    const modal = document.getElementById('categoryQuizModal');
    const modalTitle = document.getElementById('categoryModalTitle');
    const quizList = document.getElementById('categoryQuizList');
    
    if (!modal || !modalTitle || !quizList) return;
    
    modalTitle.innerHTML = `<span class="modal-title-icon">${icon}</span> ${title}`;
    quizList.innerHTML = '';
    
    if (quizzes.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-quiz-message';
        emptyMessage.textContent = 'Bu kategoride henüz quiz bulunmuyor.';
        quizList.appendChild(emptyMessage);
    } else {
        quizzes.forEach(quiz => {
            const card = createQuizCard(quiz);
            quizList.appendChild(card);
        });
    }
    
    modal.style.display = 'block';
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryQuizModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createQuizCard(quiz) {
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
    return card;
}

// Quiz'i başlat
function startQuiz(quizId) {
    const originalQuiz = quizzes.find(q => q.id === quizId);
    if (!originalQuiz) return;
    
    // Modal açıksa kapat
    closeCategoryModal();
    
    // Tarım ürünleri için items'ları karıştır, diğerleri için orijinal kullan
    const isCityMode = originalQuiz.category === 'tarim-urunleri';
    if (isCityMode) {
        // Items'ları karıştır (orijinal quiz'i değiştirmeden)
        const shuffledItems = [...originalQuiz.items].sort(() => Math.random() - 0.5);
        currentQuiz = {
            ...originalQuiz,
            items: shuffledItems
        };
    } else {
        currentQuiz = originalQuiz;
    }
    
    activeCategoryStyle = getCategoryStyle(currentQuiz.category);
    
    placedCards = {};
    cardAssignments = {};
    selectedCityForItem = null;
    currentCitySelectionIndex = null;
    currentAgricultureItemIndex = 0;
    clearSelections();
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
    
    // Tarım ürünleri için kartları gizle, soru göster
    const cardsContainer = document.getElementById('cardsContainer');
    const agricultureQuestion = document.getElementById('agricultureQuestion');
    const gameArea = document.getElementById('gameArea');
    if (isCityMode) {
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (agricultureQuestion) {
            agricultureQuestion.style.display = 'block';
            updateAgricultureQuestion();
        }
        if (gameArea) {
            gameArea.style.gridTemplateColumns = '1fr';
        }
    } else {
        if (cardsContainer) cardsContainer.style.display = 'block';
        if (agricultureQuestion) agricultureQuestion.style.display = 'none';
        if (gameArea) {
            gameArea.style.gridTemplateColumns = 'minmax(0, 1.35fr) 360px';
        }
    }
    
    setupMap();
    if (!isCityMode) {
        setupCards();
    }
    startTimer();
}

let currentAgricultureItemIndex = 0;

function updateAgricultureQuestion() {
    if (!currentQuiz || currentQuiz.category !== 'tarim-urunleri') return;
    if (currentAgricultureItemIndex >= currentQuiz.items.length) {
        currentAgricultureItemIndex = currentQuiz.items.length - 1;
    }
    const item = currentQuiz.items[currentAgricultureItemIndex];
    const questionText = document.getElementById('agricultureQuestionText');
    if (questionText && item) {
        questionText.textContent = `${item.name} nerede yetişir?`;
    }
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
    
    const isCityMode = currentQuiz.category === 'tarim-urunleri';
    const mapContainer = document.getElementById('gameMapContainer');
    const mapStage = mapContainer?.querySelector('.map-stage');
    
    if (isCityMode) {
        // Tarım ürünleri için SVG harita yükle
        if (mapStage) {
            mapStage.innerHTML = '';
            fetch('harita/map.html')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const svgElement = doc.querySelector('#svg-turkey-map');
                    if (svgElement) {
                        mapStage.appendChild(svgElement.cloneNode(true));
                        const cityNameDisplay = document.createElement('div');
                        cityNameDisplay.id = 'game-city-name';
                        cityNameDisplay.className = 'show-city-name';
                        mapStage.appendChild(cityNameDisplay);
                        
                        const svg = mapStage.querySelector('#svg-turkey-map');
                        if (svg) {
                            const paths = svg.querySelectorAll('path.city');
                            paths.forEach(path => {
                                const handleCitySelectionClick = function() {
                                    handleCitySelection(this.getAttribute('title'));
                                };
                                path.addEventListener('click', handleCitySelectionClick);
                                path.addEventListener('touchend', function(e) {
                                    e.preventDefault();
                                    handleCitySelectionClick.call(this);
                                }, { passive: false });
                        path.addEventListener('mousemove', function(e) {
                            const cityNameEl = mapStage.querySelector('#game-city-name');
                            if (cityNameEl) {
                                cityNameEl.classList.add('show-city-name--active');
                                // Harita container'ına göre konumlandır
                                const rect = mapStage.getBoundingClientRect();
                                        cityNameEl.style.left = (e.clientX - rect.left + 20) + 'px';
                                        cityNameEl.style.top = (e.clientY - rect.top + 20) + 'px';
                                cityNameEl.textContent = this.getAttribute('title');
                            }
                        });
                                path.addEventListener('mouseleave', function() {
                                    const cityNameEl = mapStage.querySelector('#game-city-name');
                                    if (cityNameEl) {
                                        cityNameEl.classList.remove('show-city-name--active');
                                    }
                                });
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('Harita yüklenirken hata:', error);
                });
        }
    } else {
        // Normal mod için resim harita
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
            point.addEventListener('click', () => handleMapPointClick(point));
            point.addEventListener('touchend', () => handleMapPointClick(point, { ignoreDragState: true }), { passive: true });
            
            mapPoints.appendChild(point);
        });
    }
}

let selectedCityForItem = null;
let currentCitySelectionIndex = null;

function handleCitySelection(cityName) {
    if (currentQuiz.category !== 'tarim-urunleri') {
        if (currentCitySelectionIndex === null) return;
        selectedCityForItem = cityName;
        placedCards[currentCitySelectionIndex] = currentQuiz.items[currentCitySelectionIndex].name;
        cardAssignments[currentCitySelectionIndex] = cityName;
        currentCitySelectionIndex = null;
    } else {
        // Tarım ürünleri modu - mevcut soru için il seç
        if (currentAgricultureItemIndex >= currentQuiz.items.length) return;
        
        const item = currentQuiz.items[currentAgricultureItemIndex];
        cardAssignments[currentAgricultureItemIndex] = cityName;
        
        // Seçilen ili vurgula
        const mapStage = document.getElementById('gameMapContainer')?.querySelector('.map-stage');
        if (mapStage) {
            const svg = mapStage.querySelector('#svg-turkey-map');
            if (svg) {
                const paths = svg.querySelectorAll('path.city');
                paths.forEach(path => {
                    const pathCity = path.getAttribute('title');
                    // Önceki seçimleri temizle
                    if (pathCity === cityName) {
                        path.style.fill = '#16a34a';
                    } else {
                        // Diğer sorular için seçilen illeri kontrol et
                        let isSelected = false;
                        for (let i = 0; i < currentQuiz.items.length; i++) {
                            if (i !== currentAgricultureItemIndex && cardAssignments[i] === pathCity) {
                                path.style.fill = '#3b82f6';
                                isSelected = true;
                                break;
                            }
                        }
                        if (!isSelected) {
                            path.style.fill = '#CCCCCC';
                        }
                    }
                });
            }
        }
        
        // Sonraki soruya geç
        currentAgricultureItemIndex++;
        if (currentAgricultureItemIndex < currentQuiz.items.length) {
            updateAgricultureQuestion();
        } else {
            // Tüm sorular cevaplandı
            const questionText = document.getElementById('agricultureQuestionText');
            if (questionText) {
                questionText.textContent = 'Tüm sorular cevaplandı! Kontrol etmek için butona tıklayın.';
            }
        }
    }
}

// Kartları hazırla
function setupCards() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';
    
    const isCityMode = currentQuiz.category === 'tarim-urunleri';
    
    // Kartları karıştır
    const shuffledItems = [...currentQuiz.items].sort(() => Math.random() - 0.5);
    const style = activeCategoryStyle || getCategoryStyle(currentQuiz.category);
    const baseColor = style.cardColor || style.lineColor || '#5a67d8';
    
    shuffledItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = item.name;
        card.draggable = !isCityMode;
        card.dataset.name = item.name;
        card.dataset.originalIndex = currentQuiz.items.findIndex(i => i.name === item.name);
        const color = lightenColor(baseColor, index * 0.08);
        card.dataset.color = color;
        card.style.borderColor = color;
        card.style.boxShadow = `0 6px 18px ${hexToRgba(color, 0.35)}`;
        card.style.background = '#fff';
        
        if (isCityMode) {
            // İl seçim modu için tıklama
            card.addEventListener('click', () => {
                const originalIndex = parseInt(card.dataset.originalIndex);
                currentCitySelectionIndex = originalIndex;
                showAlertModal(`"${item.name}" için haritadan il seçin.`, 'İl Seçimi');
            });
        } else {
            // Sürükle-bırak eventleri
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
            // Mobil (touch) desteği
            card.addEventListener('touchstart', handleTouchStart, { passive: true });
            card.addEventListener('touchend', handleTouchEnd);
            card.addEventListener('touchcancel', handleTouchEnd);
            card.addEventListener('click', () => handleCardClick(card));
        }
        
        cardsList.appendChild(card);
    });
}

// Sürükle-bırak fonksiyonları
let draggedElement = null;
let selectedCard = null;
let selectedMapPoint = null;

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
    } else {
        handleCardClick(draggedElement, { ignoreDragState: true });
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

function handleCardClick(cardEl, { ignoreDragState = false } = {}) {
    if (draggedElement && !ignoreDragState) return;
    if (selectedCard === cardEl) {
        clearCardSelection();
        return;
    }
    setSelectedCard(cardEl);
    if (selectedMapPoint) {
        assignCardToPoint(selectedMapPoint, cardEl);
    }
}

function handleMapPointClick(mapPoint, { ignoreDragState = false } = {}) {
    if (draggedElement && !ignoreDragState) return;
    if (selectedMapPoint === mapPoint) {
        clearMapPointSelection();
        return;
    }
    setSelectedMapPoint(mapPoint);
    if (selectedCard) {
        assignCardToPoint(mapPoint, selectedCard);
    }
}

function setSelectedCard(cardEl) {
    if (selectedCard && selectedCard !== cardEl) {
        selectedCard.classList.remove('selected');
    }
    selectedCard = cardEl;
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

function clearCardSelection() {
    if (!selectedCard) return;
    selectedCard.classList.remove('selected');
    selectedCard = null;
}

function setSelectedMapPoint(mapPoint) {
    if (selectedMapPoint && selectedMapPoint !== mapPoint) {
        selectedMapPoint.classList.remove('selected');
    }
    selectedMapPoint = mapPoint;
    if (selectedMapPoint) {
        selectedMapPoint.classList.add('selected');
    }
}

function clearMapPointSelection() {
    if (!selectedMapPoint) return;
    selectedMapPoint.classList.remove('selected');
    selectedMapPoint = null;
}

function clearSelections() {
    clearCardSelection();
    clearMapPointSelection();
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
    clearSelections();
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
    
    const isCityMode = currentQuiz.category === 'tarim-urunleri';
    let correct = 0;
    let wrong = 0;
    const results = [];
    
    currentQuiz.items.forEach((item, index) => {
        if (isCityMode) {
            const selectedCity = cardAssignments[index];
            const correctCity = item.city;
            
            if (selectedCity && selectedCity === correctCity) {
                correct++;
                results.push({ name: item.name, status: 'correct', placed: selectedCity });
            } else {
                wrong++;
                results.push({ 
                    name: item.name, 
                    status: 'wrong', 
                    placed: selectedCity || 'İl seçilmedi',
                    correct: correctCity
                });
            }
        } else {
            const placedCard = placedCards[index];
            const mapPoint = document.querySelector(`.map-point[data-index="${index}"]`);
            
            if (placedCard === item.name) {
                correct++;
                if (mapPoint) {
                    mapPoint.classList.add('correct');
                    mapPoint.classList.remove('wrong');
                }
                results.push({ name: item.name, status: 'correct', placed: placedCard });
            } else {
                wrong++;
                if (mapPoint) {
                    mapPoint.classList.add('wrong');
                    mapPoint.classList.remove('correct');
                }
                results.push({ 
                    name: item.name, 
                    status: 'wrong', 
                    placed: placedCard || 'Yerleştirilmedi' 
                });
            }
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
        let statusText = result.status === 'correct' ? '✓ Doğru' : `✗ Yanlış (${result.placed})`;
        if (result.correct) {
            statusText += ` - Doğru cevap: ${result.correct}`;
        }
        item.innerHTML = `
            <span><strong>${result.name}</strong></span>
            <span>${statusText}</span>
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
    const category = document.getElementById('quizCategory')?.value || 'diger';
    const isCityMode = category === 'tarim-urunleri';
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'quiz-item';
    
    if (isCityMode) {
        itemDiv.innerHTML = `
            <input type="text" class="item-name" placeholder="Ürün adı (örn: Çay)" required>
            <input type="text" class="city-input" placeholder="İl seçin" readonly required>
            <button type="button" class="btn btn-small btn-outline select-city">İl Seç</button>
            <button type="button" class="remove-item">Sil</button>
        `;
    } else {
        itemDiv.innerHTML = `
            <input type="text" class="item-name" placeholder="Öğe adı" required>
            <input type="number" class="coord-input coord-x" placeholder="X (%)" min="0" max="100" step="0.01" required>
            <input type="number" class="coord-input coord-y" placeholder="Y (%)" min="0" max="100" step="0.01" required>
            <button type="button" class="btn btn-small btn-outline select-location">Konum Seç</button>
            <button type="button" class="remove-item">Sil</button>
        `;
    }
    
    itemsList.appendChild(itemDiv);
    
    const nameInput = itemDiv.querySelector('.item-name');
    const removeBtn = itemDiv.querySelector('.remove-item');

    if (itemData) {
        nameInput.value = itemData.name || '';
        if (isCityMode) {
            const cityInput = itemDiv.querySelector('.city-input');
            if (cityInput && itemData.city) {
                cityInput.value = itemData.city;
            }
        } else {
            const xInput = itemDiv.querySelector('.coord-x');
            const yInput = itemDiv.querySelector('.coord-y');
            if (typeof itemData.x === 'number') {
                xInput.value = clampCoordinate(itemData.x).toFixed(2);
            }
            if (typeof itemData.y === 'number') {
                yInput.value = clampCoordinate(itemData.y).toFixed(2);
            }
        }
    }
    
    if (isCityMode) {
        const cityInput = itemDiv.querySelector('.city-input');
        const selectCityBtn = itemDiv.querySelector('.select-city');
        if (selectCityBtn && cityInput) {
            selectCityBtn.addEventListener('click', () => openCityPicker(cityInput));
        }
    } else {
        const xInput = itemDiv.querySelector('.coord-x');
        const yInput = itemDiv.querySelector('.coord-y');
        const selectBtn = itemDiv.querySelector('.select-location');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => openLocationPicker(xInput, yInput));
        }
        [xInput, yInput].forEach(input => {
            input.addEventListener('input', renderPickerMarkers);
        });
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            itemDiv.remove();
            if (!isCityMode) {
                renderPickerMarkers();
            }
        });
    }
    
    if (!isCityMode) {
        renderPickerMarkers();
    }
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
    const isCityMode = category === 'tarim-urunleri';
    const items = [];
    
    document.querySelectorAll('.quiz-item').forEach(itemDiv => {
        const nameInput = itemDiv.querySelector('.item-name');
        const nameValue = nameInput?.value?.trim();
        
        if (isCityMode) {
            const cityInput = itemDiv.querySelector('.city-input');
            const cityValue = cityInput?.value?.trim();
            
            if (nameValue && cityValue) {
                items.push({
                    name: nameValue,
                    city: cityValue
                });
            }
        } else {
            const xInput = itemDiv.querySelector('.coord-x');
            const yInput = itemDiv.querySelector('.coord-y');
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
        'tarim-urunleri': 'Tarım Ürünleri',
        'diger': 'Diğer'
    };
    return categories[category] || category;
}

function getCategoryStyle(category) {
    return categoryStyles[category] || categoryStyles.diger;
}
