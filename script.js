// 게임 상태 관리
var gameState = {
    currentLevel: 1,
    currentProblem: 0,
    money: parseInt(localStorage.getItem('nanugiyorisa_money') || '0', 10),
    selectedItem: null,
    selectedPieces: [],
    workspaceItems: [],
    plateItems: [],
    currentDish: null,
    problemOrder: []
};

// 레시피 데이터
var recipes = [
    {
        id: 'fish_grilled',
        name: '생선구이',
        image: 'assets/생선구이.jpg',
        price: 2500,
        ingredients: [
            { ingredient: 'fish', amount: { numerator: 1, denominator: 2 } }
        ]
    },
    {
        id: 'meat_steak',
        name: '고기스테이크',
        image: 'assets/고기스테이크.jpg',
        price: 3500,
        ingredients: [
            { ingredient: 'meat', amount: { numerator: 1, denominator: 4 } }
        ]
    },
    {
        id: 'vegetable_salad',
        name: '채소샐러드',
        image: 'assets/채소샐러드.jpg',
        price: 2000,
        ingredients: [
            { ingredient: 'vegetable', amount: { numerator: 2, denominator: 4 } }
        ]
    },
    {
        id: 'bread_slice',
        name: '빵 한 조각',
        image: 'assets/빵 한 조각.jpg',
        price: 1500,
        ingredients: [
            { ingredient: 'bread', amount: { numerator: 1, denominator: 2 } }
        ]
    },
    {
        id: 'fish_steak',
        name: '생선스테이크',
        image: 'assets/생선스테이크.jpg',
        price: 4000,
        ingredients: [
            { ingredient: 'fish', amount: { numerator: 3, denominator: 4 } }
        ]
    },
    {
        id: 'fruit_salad',
        name: '과일샐러드',
        image: 'assets/과일샐러드.jpg',
        price: 3000,
        ingredients: [
            { ingredient: 'fruit', amount: { numerator: 1, denominator: 3 } }
        ]
    },
    {
        id: 'cheese_toast',
        name: '치즈토스트',
        image: 'assets/치즈토스트.jpg',
        price: 5500,
        ingredients: [
            { ingredient: 'bread', amount: { numerator: 1, denominator: 2 } },
            { ingredient: 'cheese', amount: { numerator: 2, denominator: 3 } }
        ]
    },
    {
        id: 'fish_vegetable_stirfry',
        name: '생선채소볶음',
        image: 'assets/생선채소볶음.jpg',
        price: 6000,
        ingredients: [
            { ingredient: 'fish', amount: { numerator: 3, denominator: 2 } },
            { ingredient: 'vegetable', amount: { numerator: 1, denominator: 2 } }
        ]
    },
    {
        id: 'cheese_fruit_plate',
        name: '치즈과일플레이트',
        image: 'assets/치즈과일플레이트.jpg',
        price: 9500,
        ingredients: [
            { ingredient: 'cheese', amount: { numerator: 5, denominator: 4 } },
            { ingredient: 'fruit', amount: { numerator: 3, denominator: 2 } }
        ]
    },
    {
        id: 'meat_vegetable_skewer',
        name: '고기채소꼬치',
        image: 'assets/고기채소꼬치.jpg',
        price: 11000,
        ingredients: [
            { ingredient: 'meat', amount: { numerator: 7, denominator: 4 } },
            { ingredient: 'vegetable', amount: { numerator: 5, denominator: 3 } }
        ]
    },
    {
        id: 'bread_cheese_melt',
        name: '빵치즈구이',
        image: 'assets/빵치즈구이.jpg',
        price: 8000,
        ingredients: [
            { ingredient: 'bread', amount: { numerator: 4, denominator: 3 } },
            { ingredient: 'cheese', amount: { numerator: 2, denominator: 3 } }
        ]
    },
    {
        id: 'fish_vegetable_grill',
        name: '생선채소구이',
        image: 'assets/생선채소구이.jpg',
        price: 10000,
        ingredients: [
            { ingredient: 'fish', amount: { numerator: 2, denominator: 6 } },
            { ingredient: 'vegetable', amount: { numerator: 3, denominator: 4 } }
        ]
    },
    {
        id: 'meat_sandwich',
        name: '고기샌드위치',
        image: 'assets/고기샌드위치.jpg',
        price: 12000,
        ingredients: [
            { ingredient: 'meat', amount: { numerator: 5, denominator: 12 } },
            { ingredient: 'bread', amount: { numerator: 1, denominator: 4 } }
        ]
    }
];

// 재료 이미지/SVG 생성 함수
function createIngredientImage(type) {
    // asset 폴더에 있는 이미지 사용
    var images = {
        fish: 'assets/fish.jpg',
        meat: 'assets/meat.jpg',  // 추후 추가
        vegetable: 'assets/vegetable.jpg',  // 추후 추가
        bread: 'assets/bread.jpg',  // 추후 추가
        fruit: 'assets/fruit.jpg',  // 추후 추가
        cheese: 'assets/cheese.jpg'  // 추후 추가
    };
    
    var imagePath = images[type] || images.fish;
    return '<img src="' + imagePath + '" alt="' + type + '" style="width: 100%; height: 100%; object-fit: contain;" />';
}

// 임시 SVG (이미지가 없는 재료용)
function createFallbackSVG(type) {
    var svgs = {
        fish: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="30" rx="30" ry="20" fill="#FF9E80" stroke="#D84315" stroke-width="1.5"/><circle cx="75" cy="25" r="3" fill="#fff"/><circle cx="75" cy="25" r="1.5" fill="#000"/><path d="M 35 20 Q 15 10, 10 30 Q 15 50, 35 40 Z" fill="#FF9E80" stroke="#D84315" stroke-width="1.5"/></svg>',
        meat: '<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="35" ry="25" fill="#D32F2F" stroke="#B71C1C" stroke-width="2"/><ellipse cx="50" cy="50" rx="28" ry="20" fill="#E53935" opacity="0.7"/></svg>',
        vegetable: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 20 Q 30 35, 30 55 Q 30 75, 50 80 Q 70 75, 70 55 Q 70 35, 50 20 Z" fill="#66BB6A" stroke="#2E7D32" stroke-width="2"/></svg>',
        bread: '<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="30" width="70" height="30" rx="15" fill="#FFD54F" stroke="#F57C00" stroke-width="2"/><ellipse cx="50" cy="30" rx="35" ry="15" fill="#FFEB3B" stroke="#F57C00" stroke-width="2"/></svg>',
        fruit: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="55" r="30" fill="#E53935" stroke="#B71C1C" stroke-width="2"/><ellipse cx="45" cy="50" rx="12" ry="15" fill="#EF5350" opacity="0.6"/></svg>',
        cheese: '<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M 15 60 L 85 60 L 75 25 L 25 25 Z" fill="#FFF59D" stroke="#F9A825" stroke-width="2"/><circle cx="50" cy="45" r="5" fill="#F9A825" opacity="0.6"/></svg>'
    };
    return svgs[type] || svgs.fish;
}

// 재료 이름 매핑
var ingredientNames = {
    fish: '생선',
    meat: '고기',
    vegetable: '채소',
    bread: '빵',
    fruit: '과일',
    cheese: '치즈'
};

// 문제 데이터
var problems = [
    // Level 1: 기초 (자연수와 단순 분수)
    {
        level: 1,
        dishName: '생선구이',
        orders: [
            { ingredient: 'fish', amount: { numerator: 1, denominator: 2 }, unit: '마리' }
        ]
    },
    {
        level: 1,
        dishName: '고기스테이크',
        orders: [
            { ingredient: 'meat', amount: { numerator: 1, denominator: 4 }, unit: '덩이' }
        ]
    },
    {
        level: 1,
        dishName: '채소샐러드',
        orders: [
            { ingredient: 'vegetable', amount: { numerator: 2, denominator: 4 }, unit: '개' }
        ]
    },
    {
        level: 1,
        dishName: '빵 한 조각',
        orders: [
            { ingredient: 'bread', amount: { numerator: 1, denominator: 2 }, unit: '개' }
        ]
    },
    {
        level: 1,
        dishName: '생선스테이크',
        orders: [
            { ingredient: 'fish', amount: { numerator: 3, denominator: 4 }, unit: '마리' }
        ]
    },
    
    // Level 2: 중급 (단위 분수와 3등분)
    {
        level: 2,
        dishName: '과일샐러드',
        orders: [
            { ingredient: 'fruit', amount: { numerator: 1, denominator: 3 }, unit: '개' }
        ]
    },
    {
        level: 2,
        dishName: '치즈토스트',
        orders: [
            { ingredient: 'bread', amount: { numerator: 1, denominator: 2 }, unit: '개' },
            { ingredient: 'cheese', amount: { numerator: 2, denominator: 3 }, unit: '조각' }
        ]
    },
    {
        level: 2,
        dishName: '생선채소볶음',
        orders: [
            { ingredient: 'fish', amount: { numerator: 3, denominator: 2 }, unit: '마리' },
            { ingredient: 'vegetable', amount: { numerator: 1, denominator: 2 }, unit: '개' }
        ]
    },
    
    // Level 3: 고급 (가분수/대분수 사용)
    {
        level: 3,
        dishName: '치즈과일플레이트',
        orders: [
            { ingredient: 'cheese', amount: { numerator: 5, denominator: 4 }, unit: '조각' },
            { ingredient: 'fruit', amount: { numerator: 3, denominator: 2 }, unit: '개' }
        ]
    },
    {
        level: 3,
        dishName: '고기채소꼬치',
        orders: [
            { ingredient: 'meat', amount: { numerator: 7, denominator: 4 }, unit: '덩이' },
            { ingredient: 'vegetable', amount: { numerator: 5, denominator: 3 }, unit: '개' }
        ]
    },
    {
        level: 3,
        dishName: '빵치즈구이',
        orders: [
            { ingredient: 'bread', amount: { numerator: 4, denominator: 3 }, unit: '개' },
            { ingredient: 'cheese', amount: { numerator: 2, denominator: 3 }, unit: '조각' }
        ]
    },
    {
        level: 3,
        dishName: '생선채소구이',
        orders: [
            { ingredient: 'fish', amount: { numerator: 2, denominator: 6 }, unit: '마리' },
            { ingredient: 'vegetable', amount: { numerator: 3, denominator: 4 }, unit: '개' }
        ]
    },
    {
        level: 3,
        dishName: '고기샌드위치',
        orders: [
            { ingredient: 'meat', amount: { numerator: 5, denominator: 12 }, unit: '덩이' },
            { ingredient: 'bread', amount: { numerator: 1, denominator: 4 }, unit: '개' }
        ]
    }
];

// 분수 최대공약수 계산
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// 분수 약분
function simplifyFraction(numerator, denominator) {
    var divisor = gcd(numerator, denominator);
    return {
        numerator: numerator / divisor,
        denominator: denominator / divisor
    };
}

// 분수 더하기
function addFractions(f1, f2) {
    var numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
    var denominator = f1.denominator * f2.denominator;
    return { numerator: numerator, denominator: denominator };
}

// 분수 비교 (같은지 확인)
function compareFractions(f1, f2) {
    var simplified1 = simplifyFraction(f1.numerator, f1.denominator);
    var simplified2 = simplifyFraction(f2.numerator, f2.denominator);
    return simplified1.numerator === simplified2.numerator && 
           simplified1.denominator === simplified2.denominator;
}

// 분수를 대분수로 변환 (numerator > denominator일 때)
function toMixedNumber(fraction) {
    if (fraction.numerator <= fraction.denominator) {
        return { whole: 0, numerator: fraction.numerator, denominator: fraction.denominator };
    }
    var whole = Math.floor(fraction.numerator / fraction.denominator);
    var remainder = fraction.numerator % fraction.denominator;
    return { whole: whole, numerator: remainder, denominator: fraction.denominator };
}

// 대분수를 HTML로 변환
function mixedNumberToHTML(mixed) {
    if (mixed.whole === 0) {
        // 진분수
        if (mixed.denominator === 1) {
            return '<span>' + mixed.numerator + '</span>';
        }
        return '<div class="fraction-display"><span class="numerator">' + mixed.numerator + '</span><span class="fraction-line"></span><span class="denominator">' + mixed.denominator + '</span></div>';
    } else if (mixed.numerator === 0) {
        // 자연수
        return '<span>' + mixed.whole + '</span>';
    } else {
        // 대분수
        return '<span style="display: flex; align-items: center; gap: 3px;">' +
            '<span style="font-size: 1.1em; font-weight: bold; color: #000000;">' + mixed.whole + '</span>' +
            '<div class="fraction-display" style="font-size: 0.9em;"><span class="numerator">' + mixed.numerator + '</span><span class="fraction-line"></span><span class="denominator">' + mixed.denominator + '</span></div>' +
        '</span>';
    }
}

// 분수를 세로 HTML로 변환
function fractionToHTML(fraction) {
    if (fraction.denominator === 1) {
        return '<span>' + fraction.numerator + '</span>';
    }
    return '<div class="fraction-display"><span class="numerator">' + fraction.numerator + '</span><span class="fraction-line"></span><span class="denominator">' + fraction.denominator + '</span></div>';
}

// 현재 문제 로드
function loadProblem() {
    var problem = gameState.problemOrder[gameState.currentProblem];
    var orderContent = document.getElementById('orderContent');
    orderContent.innerHTML = '';
    
    // 요리 이름 표시
    if (problem.dishName) {
        var dishTitle = document.createElement('div');
        dishTitle.className = 'dish-title';
        dishTitle.innerHTML = '<h3>🍲 ' + problem.dishName + '</h3>';
        orderContent.appendChild(dishTitle);
    }
    
    // 레시피 섹션
    var recipeSection = document.createElement('div');
    recipeSection.className = 'recipe-section';
    
    var recipeTitle = document.createElement('div');
    recipeTitle.className = 'recipe-title';
    recipeTitle.innerHTML = '📝 필요한 재료';
    recipeSection.appendChild(recipeTitle);
    
    for (var i = 0; i < problem.orders.length; i++) {
        var order = problem.orders[i];
        var orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        var imageIcon = createIngredientImage(order.ingredient);
        var name = ingredientNames[order.ingredient];
        var amount = order.amount;
        
        // 대분수로 변환
        var mixed = toMixedNumber(amount);
        var amountHTML = mixedNumberToHTML(mixed);
        
        orderItem.innerHTML = '<span class="ingredient-icon">' + imageIcon + '</span>' +
            '<span class="ingredient-name">' + name + '</span>' +
            '<span style="display: flex; align-items: center; gap: 5px; font-size: 1.1em; color: #000000; font-weight: 600;">' + 
                amountHTML + '<span class="unit" style="color: #000000;">' + order.unit + '</span>' +
            '</span>';
        
        recipeSection.appendChild(orderItem);
    }
    
    orderContent.appendChild(recipeSection);
    
    document.getElementById('levelDisplay').textContent = '레벨 ' + problem.level;
    
    // 작업대와 접시 초기화
    clearWorkspace();
    clearPlate();
}

// 재료 추가 함수
function addIngredientToWorkspace(ingredientType) {
    var workspaceArea = document.getElementById('workspaceArea');
    
    var item = {
        id: Date.now(),
        type: ingredientType,
        divided: false,
        parts: 1,
        pieces: []
    };
    
    gameState.workspaceItems.push(item);
    
    var itemElement = document.createElement('div');
    itemElement.className = 'ingredient-item';
    itemElement.dataset.itemId = item.id;
    
    var imageHTML = createIngredientImage(ingredientType);
    itemElement.innerHTML = '<div class="item-icon">' + imageHTML + '</div>' +
        '<div class="item-label">' + ingredientNames[ingredientType] + '</div>';
    
    itemElement.addEventListener('click', function() {
        selectItem(item.id);
    });
    
    workspaceArea.appendChild(itemElement);
    workspaceArea.classList.add('has-items');
    
    // 애니메이션 효과
    itemElement.style.animation = 'placeOnPlate 0.3s ease';
}

// 아이템 선택
function selectItem(itemId) {
    gameState.selectedItem = itemId;
    
    // 모든 아이템의 선택 해제
    var allItems = document.querySelectorAll('.ingredient-item');
    for (var i = 0; i < allItems.length; i++) {
        allItems[i].classList.remove('selected');
    }
    
    // 선택된 아이템 하이라이트
    var selectedElement = document.querySelector('[data-item-id="' + itemId + '"]');
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    // 등분 버튼과 접시로 가져가기 버튼 활성화
    var item = null;
    for (var j = 0; j < gameState.workspaceItems.length; j++) {
        if (gameState.workspaceItems[j].id === itemId) {
            item = gameState.workspaceItems[j];
            break;
        }
    }
    
    // 나눠지지 않은 재료만 통째로 접시에 담을 수 있음
    document.getElementById('moveWholeToPLateBtn').disabled = item && item.divided;
    if (item && !item.divided) {
        document.getElementById('divideBtn').disabled = false;
    } else {
        document.getElementById('divideBtn').disabled = true;
    }
}

// 등분하기 모달 열기
function openDivideModal() {
    if (!gameState.selectedItem) return;
    
    var modal = document.getElementById('divideModal');
    modal.classList.add('show');
}

// 등분 실행
function divideIngredient(parts) {
    var item = null;
    for (var j = 0; j < gameState.workspaceItems.length; j++) {
        if (gameState.workspaceItems[j].id === gameState.selectedItem) {
            item = gameState.workspaceItems[j];
            break;
        }
    }
    if (!item) return;
    
    item.divided = true;
    item.parts = parts;
    item.pieces = [];
    for (var k = 0; k < parts; k++) {
        item.pieces.push({
            index: k,
            selected: false
        });
    }
    
    // UI 업데이트
    var itemElement = document.querySelector('[data-item-id="' + item.id + '"]');
    itemElement.remove();
    
    var dividedElement = document.createElement('div');
    dividedElement.className = 'ingredient-divided';
    dividedElement.dataset.itemId = item.id;
    
    // 원본 크기 설정 (가로로 자르기)
    var originalWidth = 120;  // 원본 전체 너비
    var originalHeight = 80;  // 원본 전체 높이
    var pieceWidth = originalWidth / parts;  // 각 조각의 너비
    
    for (var i = 0; i < parts; i++) {
        var piece = document.createElement('div');
        piece.className = 'piece';
        piece.dataset.pieceIndex = i;
        
        // 각 조각은 원본 이미지의 일부분만 보여줌 (clip 사용)
        var clipLeft = (i / parts) * 100;
        var clipRight = ((i + 1) / parts) * 100;
        
        // 이미지를 자른 것처럼 보이게 하는 컨테이너
        var pieceHTML = '<div class="piece-icon" style="width: ' + pieceWidth + 'px; height: ' + originalHeight + 'px; overflow: hidden; position: relative; background: #f0f0f0;">' +
            '<img src="assets/' + item.type + '.jpg" alt="' + item.type + '" style="position: absolute; left: -' + (i * pieceWidth) + 'px; top: 0; width: ' + originalWidth + 'px; height: ' + originalHeight + 'px; object-fit: fill; display: block;" onerror="this.outerHTML=\'' + createFallbackSVG(item.type).replace(/'/g, "\\'") + '\'">' +
            (i < parts - 1 ? '<div class="cut-line-overlay" style="position: absolute; right: -1px; top: 0; width: 2px; height: 100%; background: rgba(0,0,0,0.4); z-index: 10;"></div>' : '') +
        '</div>' +
        '<div class="piece-label">' +
            '<span class="fraction-num">1</span>' +
            '<span class="fraction-den">' + parts + '</span>' +
        '</div>';
        
        piece.innerHTML = pieceHTML;
        
        (function(itemId, index) {
            piece.addEventListener('click', function() {
                togglePieceSelection(itemId, index);
            });
        })(item.id, i);
        
        dividedElement.appendChild(piece);
    }
    
    document.getElementById('workspaceArea').appendChild(dividedElement);
    
    // 모달 닫기
    document.getElementById('divideModal').classList.remove('show');
    gameState.selectedItem = null;
    document.getElementById('divideBtn').disabled = true;
}

// 조각 선택/해제
function togglePieceSelection(itemId, pieceIndex) {
    var item = null;
    for (var i = 0; i < gameState.workspaceItems.length; i++) {
        if (gameState.workspaceItems[i].id === itemId) {
            item = gameState.workspaceItems[i];
            break;
        }
    }
    if (!item) return;
    
    item.pieces[pieceIndex].selected = !item.pieces[pieceIndex].selected;
    
    // UI 업데이트
    var pieceElement = document.querySelector('[data-item-id="' + itemId + '"] [data-piece-index="' + pieceIndex + '"]');
    
    if (item.pieces[pieceIndex].selected) {
        pieceElement.classList.add('selected');
    } else {
        pieceElement.classList.remove('selected');
    }
}

// 통째 재료를 접시에 담기
function moveWholeToPLate() {
    if (!gameState.selectedItem) return;
    
    var item = null;
    var itemIndex = -1;
    for (var i = 0; i < gameState.workspaceItems.length; i++) {
        if (gameState.workspaceItems[i].id === gameState.selectedItem) {
            item = gameState.workspaceItems[i];
            itemIndex = i;
            break;
        }
    }
    
    if (!item || item.divided) return;
    
    // 접시에 통째 재료 추가 (1/1 = 1개)
    gameState.plateItems.push({
        type: item.type,
        fraction: { numerator: 1, denominator: 1 },
        isWhole: true
    });
    
    // 작업대에서 제거
    var itemElement = document.querySelector('[data-item-id="' + item.id + '"]');
    if (itemElement) itemElement.remove();
    
    gameState.workspaceItems.splice(itemIndex, 1);
    
    // 선택 해제
    gameState.selectedItem = null;
    document.getElementById('divideBtn').disabled = true;
    document.getElementById('moveWholeToPLateBtn').disabled = true;
    
    updatePlateDisplay();
    checkWorkspaceEmpty();
}

// 선택된 조각을 접시에 담기
function moveToPLate() {
    for (var i = 0; i < gameState.workspaceItems.length; i++) {
        var item = gameState.workspaceItems[i];
        if (item.divided) {
            for (var j = 0; j < item.pieces.length; j++) {
                var piece = item.pieces[j];
                if (piece.selected) {
                    gameState.plateItems.push({
                        type: item.type,
                        fraction: { numerator: 1, denominator: item.parts },
                        pieceIndex: j,
                        totalParts: item.parts
                    });
                    
                    // UI에서 조각 제거
                    var pieceElement = document.querySelector('[data-item-id="' + item.id + '"] [data-piece-index="' + j + '"]');
                    if (pieceElement) {
                        pieceElement.remove();
                    }
                    
                    piece.selected = false;
                }
            }
            
            // 모든 조각이 제거되면 전체 아이템 제거
            var remainingCount = 0;
            for (var k = 0; k < item.pieces.length; k++) {
                var el = document.querySelector('[data-item-id="' + item.id + '"] [data-piece-index="' + k + '"]');
                if (el !== null) remainingCount++;
            }
            
            if (remainingCount === 0) {
                var itemElement = document.querySelector('[data-item-id="' + item.id + '"]');
                if (itemElement) itemElement.remove();
                
                var newItems = [];
                for (var m = 0; m < gameState.workspaceItems.length; m++) {
                    if (gameState.workspaceItems[m].id !== item.id) {
                        newItems.push(gameState.workspaceItems[m]);
                    }
                }
                gameState.workspaceItems = newItems;
            }
        }
    }
    
    updatePlateDisplay();
    checkWorkspaceEmpty();
}

// 접시 디스플레이 업데이트
function updatePlateDisplay() {
    var plateContent = document.getElementById('plateContent');
    plateContent.innerHTML = '';
    
    for (var i = 0; i < gameState.plateItems.length; i++) {
        var item = gameState.plateItems[i];
        var piece = document.createElement('div');
        piece.className = 'plate-piece';
        piece.dataset.plateIndex = i;
        
        // 통째 재료인지 조각인지 확인
        if (item.isWhole) {
            // 통째로 올린 재료는 큰 크기로 표시
            var wholeHTML = '<div class="piece-icon" style="width: 60px; height: 40px; overflow: hidden; position: relative; border-radius: 5px; border: 2px solid #4caf50;">' +
                '<img src="assets/' + item.type + '.jpg" alt="' + item.type + '" style="width: 100%; height: 100%; object-fit: fill; display: block;" onerror="this.outerHTML=\'' + createFallbackSVG(item.type).replace(/'/g, "\\'") + '\'">' +
            '</div>';
            piece.innerHTML = wholeHTML;
        } else if (item.pieceIndex !== undefined && item.totalParts) {
            // 조각 정보가 있으면 작업대와 동일하게 표시
            var plateWidth = 60;
            var plateHeight = 40;
            var piecePlateWidth = plateWidth / item.totalParts;
            
            var pieceHTML = '<div class="piece-icon" style="width: ' + piecePlateWidth + 'px; height: ' + plateHeight + 'px; overflow: hidden; position: relative; background: #f0f0f0; border-radius: 3px;">' +
                '<img src="assets/' + item.type + '.jpg" alt="' + item.type + '" style="position: absolute; left: -' + (item.pieceIndex * piecePlateWidth) + 'px; top: 0; width: ' + plateWidth + 'px; height: ' + plateHeight + 'px; object-fit: fill; display: block;" onerror="this.outerHTML=\'' + createFallbackSVG(item.type).replace(/'/g, "\\'") + '\'">' +
            '</div>';
            piece.innerHTML = pieceHTML;
        } else {
            // 조각 정보가 없으면 기본 SVG 사용
            var pieceSize = 35;
            var imageHTML = createIngredientImage(item.type);
            piece.innerHTML = '<div class="piece-svg" style="width: ' + pieceSize + 'px; height: ' + pieceSize + 'px;">' + imageHTML + '</div>';
        }
        
        (function(index) {
            piece.addEventListener('click', function() {
                removeFromPlate(index);
            });
        })(i);
        
        plateContent.appendChild(piece);
    }
    
    // 현재 양 계산 및 표시
    var amounts = calculatePlateAmounts();
    var amountDisplay = document.getElementById('currentAmount');
    
    var displayHTML = '<div style="display: flex; gap: 15px; align-items: center; justify-content: center;">현재: ';
    var entries = Object.keys(amounts);
    
    if (entries.length === 0) {
        displayHTML += '0';
    } else {
        for (var j = 0; j < entries.length; j++) {
            var type = entries[j];
            var fraction = amounts[type];
            var simplified = simplifyFraction(fraction.numerator, fraction.denominator);
            var fractionHTML = fractionToHTML(simplified);
            displayHTML += '<span style="display: flex; align-items: center; gap: 5px;">' + ingredientNames[type] + ' ' + fractionHTML + '</span>';
        }
    }
    
    displayHTML += '</div>';
    amountDisplay.innerHTML = displayHTML;
    
    // 요리하기 버튼 활성화/비활성화
    document.getElementById('cookBtn').disabled = gameState.plateItems.length === 0;
}

// 접시에서 제거
function removeFromPlate(index) {
    gameState.plateItems.splice(index, 1);
    updatePlateDisplay();
}

// 접시의 재료량 계산
function calculatePlateAmounts() {
    var amounts = {};
    
    for (var i = 0; i < gameState.plateItems.length; i++) {
        var item = gameState.plateItems[i];
        if (!amounts[item.type]) {
            amounts[item.type] = { numerator: 0, denominator: 1 };
        }
        
        // 분수 덧셈: a/b + c/d = (ad + bc) / bd
        var a = amounts[item.type].numerator;
        var b = amounts[item.type].denominator;
        var c = item.fraction.numerator;
        var d = item.fraction.denominator;
        
        amounts[item.type] = {
            numerator: a * d + b * c,
            denominator: b * d
        };
        
        // 약분
        amounts[item.type] = simplifyFraction(
            amounts[item.type].numerator,
            amounts[item.type].denominator
        );
    }
    
    return amounts;
}

// 정답 확인
function checkAnswer() {
    if (!gameState.currentDish) {
        alert('요리를 먼저 완성해주세요!');
        return;
    }
    
    var problem = gameState.problemOrder[gameState.currentProblem];
    var isCorrect = false;
    
    // 현재 요리가 주문서에 있는 요리인지 확인
    if (gameState.currentDish.name === problem.dishName) {
        isCorrect = true;
    }
    
    showResult(isCorrect);
}

// 결과 표시
function showResult(isCorrect) {
    var modal = document.getElementById('resultModal');
    var resultContent = document.getElementById('resultContent');
    
    if (isCorrect) {
        // 요리 가격만큼 돈 추가
        var earnedMoney = gameState.currentDish ? gameState.currentDish.price : 0;
        gameState.money += earnedMoney;
        
        // localStorage에 저장
        localStorage.setItem('nanugiyorisa_money', gameState.money.toString());
        
        document.getElementById('moneyDisplay').textContent = '💰 ' + gameState.money + '원';
        
        var messages = [
            '완벽해요! 🌟',
            '정말 잘했어요! ⭐',
            '훌륭해요! 🎉',
            '멋져요! 🎊',
            '최고예요! 🏆'
        ];
        
        var message = messages[Math.floor(Math.random() * messages.length)];
        
        resultContent.innerHTML = '<div class="result-content-success">' +
                '<div class="star-animation">⭐</div>' +
                '<h2>' + message + '</h2>' +
                '<p>정확한 양을 서빙했어요!</p>' +
                '<p style="font-size: 1.2em; color: #4caf50; font-weight: bold;">+10점 / +' + earnedMoney.toLocaleString() + '원</p>' +
            '</div>';
        
        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('retryBtn').style.display = 'none';
    } else {
        var messages = [
            '아쉬워요! 다시 한번 해볼까요? 😊',
            '조금만 더 생각해보세요! 💪',
            '거의 다 왔어요! 다시 도전! 🌈',
            '힌트를 참고해보세요! 💡'
        ];
        
        var message = messages[Math.floor(Math.random() * messages.length)];
        
        resultContent.innerHTML = '<div class="result-content-fail">' +
                '<h2>😅</h2>' +
                '<p>' + message + '</p>' +
                '<p>주문과 다른 양이에요</p>' +
            '</div>';
        
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('retryBtn').style.display = 'inline-block';
    }
    
    modal.classList.add('show');
}

// 다음 문제로 이동
function nextProblem() {
    gameState.currentProblem++;
    
    if (gameState.currentProblem >= gameState.problemOrder.length) {
        // 게임 완료
        showGameComplete();
        return;
    }
    
    var nextLevel = gameState.problemOrder[gameState.currentProblem].level;
    if (nextLevel !== gameState.currentLevel) {
        gameState.currentLevel = nextLevel;
    }
    
    loadProblem();
    document.getElementById('resultModal').classList.remove('show');
}

// 게임 완료
function showGameComplete() {
    var resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = '<div class="result-content-success">' +
            '<div class="star-animation">🏆</div>' +
            '<h2>축하합니다!</h2>' +
            '<p>모든 문제를 완료했어요!</p>' +
            '<p>최종 수익: 💰 ' + gameState.money + '원</p>' +
        '</div>';
    
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').textContent = '처음부터 다시';
    document.getElementById('retryBtn').style.display = 'none';
}

// 재시도
function retryProblem() {
    clearPlate();
    document.getElementById('resultModal').classList.remove('show');
}

// 작업대 비우기
function clearWorkspace() {
    gameState.workspaceItems = [];
    gameState.selectedItem = null;
    gameState.selectedPieces = [];
    
    var workspaceArea = document.getElementById('workspaceArea');
    workspaceArea.innerHTML = '<div class="workspace-placeholder">재료를 여기로 가져오세요</div>';
    workspaceArea.classList.remove('has-items');
    
    document.getElementById('divideBtn').disabled = true;
}

// 접시 비우기
function clearPlate() {
    gameState.plateItems = [];
    gameState.currentDish = null;
    updatePlateDisplay();
    hideDishResult();
}

// 요리 결과 숨기기
function hideDishResult() {
    document.getElementById('dishResult').style.display = 'none';
    document.getElementById('plateArea').style.display = 'flex';
    document.getElementById('cookBtn').disabled = gameState.plateItems.length === 0;
}

// 요리 결과 표시
function showDishResult(dish) {
    var dishResult = document.getElementById('dishResult');
    dishResult.innerHTML = '<h4 style="text-align: center; color: #667eea; margin-bottom: 10px;">완성된 요리</h4>' +
        '<div class="dish-image-container" style="text-align: center;">' +
            '<img src="' + dish.image + '" alt="' + dish.name + '" style="width: 100%; max-width: 200px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); animation: placeOnPlate 0.5s ease;" onerror="this.src=\'data:image/svg+xml,\' + encodeURIComponent(\'<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 200 200&quot;><rect fill=&quot;#f0f0f0&quot; width=&quot;200&quot; height=&quot;200&quot;/><text x=&quot;100&quot; y=&quot;100&quot; text-anchor=&quot;middle&quot; font-size=&quot;20&quot; fill=&quot;#999&quot;>이미지 없음</text></svg>\')">' +
            '<div style="text-align: center; font-size: 1.2em; font-weight: bold; color: #495057; margin-top: 10px;">' + dish.name + '</div>' +
        '</div>' +
        '<div class="dish-controls" style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">' +
            '<button id="serveBtn" class="btn btn-serve">서빙하기</button>' +
            '<button id="discardBtn" class="btn btn-secondary">버리기</button>' +
        '</div>';
    
    dishResult.style.display = 'block';
    document.getElementById('plateArea').style.display = 'none';
    
    // 버튼 이벤트 리스너 다시 연결
    document.getElementById('serveBtn').addEventListener('click', checkAnswer);
    document.getElementById('discardBtn').addEventListener('click', discardDish);
}

// 레시피 매칭 함수
function findMatchingRecipe() {
    var amounts = calculatePlateAmounts();
    
    for (var i = 0; i < recipes.length; i++) {
        var recipe = recipes[i];
        var match = true;
        
        // 재료 개수가 같은지 확인
        if (Object.keys(amounts).length !== recipe.ingredients.length) {
            continue;
        }
        
        // 각 재료와 양이 일치하는지 확인
        for (var j = 0; j < recipe.ingredients.length; j++) {
            var recipeIng = recipe.ingredients[j];
            var plateAmount = amounts[recipeIng.ingredient];
            
            if (!plateAmount) {
                match = false;
                break;
            }
            
            // 분수 약분 후 비교
            var recipeSimplified = simplifyFraction(recipeIng.amount.numerator, recipeIng.amount.denominator);
            var plateSimplified = simplifyFraction(plateAmount.numerator, plateAmount.denominator);
            
            if (recipeSimplified.numerator !== plateSimplified.numerator || 
                recipeSimplified.denominator !== plateSimplified.denominator) {
                match = false;
                break;
            }
        }
        
        if (match) {
            return recipe;
        }
    }
    
    return null;
}

// 요리하기
function cookDish() {
    if (gameState.plateItems.length === 0) return;
    
    // 요리 중 상태 표시
    showCookingStatus();
    
    // 버튼 비활성화
    document.getElementById('cookBtn').disabled = true;
    document.getElementById('clearPlateBtn').disabled = true;
    
    // 2-3초 후 요리 완성
    var cookingTime = 2000 + Math.random() * 1000; // 2~3초
    
    setTimeout(function() {
        var matchedRecipe = findMatchingRecipe();
        
        if (matchedRecipe) {
            gameState.currentDish = matchedRecipe;
            showDishResult(matchedRecipe);
        } else {
            // 레시피에 없는 요리는 '정체불명의 요리'로 제작
            var amounts = calculatePlateAmounts();
            var ingredientList = [];
            var types = Object.keys(amounts);
            for (var i = 0; i < types.length; i++) {
                ingredientList.push(ingredientNames[types[i]]);
            }
            
            var unknownDish = {
                id: 'unknown',
                name: '정체불명의 요리',
                image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#e0e0e0" width="200" height="200" rx="15"/><text x="100" y="90" text-anchor="middle" font-size="60" fill="#666">❓</text><text x="100" y="130" text-anchor="middle" font-size="18" fill="#999">정체불명</text><text x="100" y="155" text-anchor="middle" font-size="14" fill="#aaa">(' + ingredientList.join(', ') + ')</text></svg>'),
                ingredients: []
            };
            
            gameState.currentDish = unknownDish;
            showDishResult(unknownDish);
        }
        
        // 접시 비우기 (재료는 요리로 변환됨)
        gameState.plateItems = [];
        updatePlateDisplay();
        
        // 버튼 다시 활성화
        document.getElementById('clearPlateBtn').disabled = false;
    }, cookingTime);
}

// 요리 중 상태 표시
function showCookingStatus() {
    var plateArea = document.getElementById('plateArea');
    var dishResult = document.getElementById('dishResult');
    
    plateArea.style.display = 'none';
    dishResult.style.display = 'block';
    dishResult.innerHTML = '<div style="text-align: center; padding: 40px;">' +
        '<div style="font-size: 60px; animation: cooking 1s infinite;">🍳</div>' +
        '<h3 style="color: #ff9800; margin-top: 20px; animation: pulse 1.5s ease-in-out infinite;">요리 중...</h3>' +
        '<p style="color: #999; margin-top: 10px;">맛있게 조리하고 있어요!</p>' +
    '</div>';
}

// 요리 버리기
function discardDish() {
    gameState.currentDish = null;
    hideDishResult();
}

// 작업대가 비었는지 확인
function checkWorkspaceEmpty() {
    var workspaceArea = document.getElementById('workspaceArea');
    if (gameState.workspaceItems.length === 0) {
        workspaceArea.classList.remove('has-items');
    }
}

// 힌트 표시
function showHint() {
    var problem = gameState.problemOrder[gameState.currentProblem];
    var modal = document.getElementById('hintModal');
    var hintContent = document.getElementById('hintContent');
    
    var hints = '<ol>';
    
    for (var i = 0; i < problem.orders.length; i++) {
        var order = problem.orders[i];
        var name = ingredientNames[order.ingredient];
        var numerator = order.amount.numerator;
        var denominator = order.amount.denominator;
        
        var fractionHTML = '<div class="fraction-display" style="display: inline-flex; margin: 0 3px;">' +
            '<span class="numerator">' + numerator + '</span>' +
            '<span class="fraction-line"></span>' +
            '<span class="denominator">' + denominator + '</span>' +
        '</div>';
        
        hints += '<li><strong>' + name + ' ' + fractionHTML + ' ' + order.unit + '</strong><br>';
        hints += '→ ' + name + '을(를) 1개 가져온 후 <strong>' + denominator + '등분</strong>하고<br>';
        hints += '→ 그 중 <strong>' + numerator + '조각</strong>을 접시에 담으세요</li>';
    }
    
    hints += '</ol>';
    hintContent.innerHTML = hints;
    modal.classList.add('show');
}

// 이벤트 리스너 설정
function initEventListeners() {
    // 재료통 클릭
    var storageItems = document.querySelectorAll('.storage-item');
    for (var i = 0; i < storageItems.length; i++) {
        (function(item) {
            item.addEventListener('click', function() {
                var ingredientType = item.dataset.ingredient;
                addIngredientToWorkspace(ingredientType);
            });
        })(storageItems[i]);
    }
    
    // 등분 버튼
    document.getElementById('divideBtn').addEventListener('click', openDivideModal);
    
    // 등분 옵션 선택
    var divideOptions = document.querySelectorAll('.divide-option');
    for (var j = 0; j < divideOptions.length; j++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var parts = parseInt(btn.dataset.parts);
                divideIngredient(parts);
            });
        })(divideOptions[j]);
    }
    
    // 등분 취소
    document.getElementById('cancelDivide').addEventListener('click', function() {
        document.getElementById('divideModal').classList.remove('show');
    });
    
    // 접시에 담기 (선택된 조각 자동 이동)
    document.getElementById('workspaceArea').addEventListener('click', function(e) {
        if (e.target.classList.contains('piece') || e.target.closest('.piece')) {
            // 조각 클릭 시 선택/해제하고 바로 접시로 이동
            setTimeout(function() {
                moveToPLate();
            }, 100);
        }
    });
    
    // 요리하기 버튼
    document.getElementById('cookBtn').addEventListener('click', cookDish);
    
    // 서빙 버튼
    document.getElementById('serveBtn').addEventListener('click', checkAnswer);
    
    // 요리 버리기 버튼
    document.getElementById('discardBtn').addEventListener('click', discardDish);
    
    // 통째로 접시에 담기
    document.getElementById('moveWholeToPLateBtn').addEventListener('click', moveWholeToPLate);
    
    // 작업대 비우기
    document.getElementById('clearWorkspaceBtn').addEventListener('click', clearWorkspace);
    
    // 접시 비우기
    document.getElementById('clearPlateBtn').addEventListener('click', clearPlate);
    
    // 초기화 버튼
    document.getElementById('resetButton').addEventListener('click', function() {
        if (confirm('돈을 초기화하시겠습니까? 모든 매출이 사라집니다.')) {
            gameState.money = 0;
            localStorage.setItem('nanugiyorisa_money', '0');
            document.getElementById('moneyDisplay').textContent = '💰 0원';
        }
    });
    
    // 결과 모달 버튼
    document.getElementById('nextBtn').addEventListener('click', function() {
        if (gameState.currentProblem >= gameState.problemOrder.length - 1) {
            // 게임 재시작
            gameState.currentProblem = 0;
            gameState.currentLevel = 1;
            gameState.money = 0;
            // localStorage 초기화
            localStorage.setItem('nanugiyorisa_money', '0');
            // Reshuffle problems for new game
            gameState.problemOrder = shuffleArray(problems.slice());
            document.getElementById('moneyDisplay').textContent = '💰 0원';
            document.getElementById('nextBtn').textContent = '다음 문제';
            loadProblem();
            document.getElementById('resultModal').classList.remove('show');
        } else {
            nextProblem();
        }
    });
    
    document.getElementById('retryBtn').addEventListener('click', retryProblem);
    
    // 힌트 버튼
    document.getElementById('hintBtn').addEventListener('click', showHint);
    
    // 힌트 닫기
    document.getElementById('closeHint').addEventListener('click', function() {
        document.getElementById('hintModal').classList.remove('show');
    });
    
    // 모달 배경 클릭 시 닫기
    var modals = document.querySelectorAll('.modal');
    for (var k = 0; k < modals.length; k++) {
        (function(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        })(modals[k]);
    }
}

// 레시피 로드
// 게임 초기화
function initGame() {
    console.log('레시피 로드 완료:', recipes.length + '개');
    
    // Shuffle problems to randomize order
    gameState.problemOrder = shuffleArray(problems.slice());
    
    initEventListeners();
    loadProblem();
    document.getElementById('moneyDisplay').textContent = '💰 ' + gameState.money + '원';
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    var shuffled = array.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

// 페이지 로드 시 게임 시작
window.addEventListener('DOMContentLoaded', initGame);
