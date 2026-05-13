class CandyCrushGame {
  constructor() {
    this.gridRows = 5;
    this.gridCols = 5;
    this.productTypes = [
      'product1.png',
      'product2.png',
      'product3-1.png',
      'product4-1.png',
    ];
    this.grid = [];
    this.score = 0;
    this.timeLeft = 20;
    this.gameActive = false;
    this.selectedCell = null;
    this.timerInterval = null;
    this.isAnimating = false;
    this.comboLevel = 0;

    this.draggables = [];
    this.dragStartCell = null;

    this.pageClickListener = null;
    this.closeIconListener = null;

    this.backgroundAudio = null;
    this.winAudio = null;
    this.loseAudio = null;

    this.helpingHand = null;
    this.hintTimeout = null;
    this.lastActivityTime = Date.now();
    this.hintShown = false;

    this.initializeElements();
    this.initializeAudio();
    this.setupEventListeners();
    this.initializeGrid();
    this.showGameContainer();
  }

  initializeElements() {
    this.startDialog = document.getElementById('startDialog');
    this.endDialog = document.getElementById('endDialog');
    this.gameContainer = document.getElementById('gameContainer');
    this.gameGrid = document.getElementById('gameGrid');
    this.timerElement = document.getElementById('timer');
    this.scoreElement = document.getElementById('score');
    this.finalScoreElement = document.getElementById('finalScore');
    this.startBtn = document.getElementById('startBtn');
    this.rewardBtn = document.getElementById('rewardBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.startCloseIcon = document.getElementById('startCloseIcon');
    this.endCloseIcon = document.getElementById('endCloseIcon');
    this.helpingHand = document.getElementById('helpingHand');

    console.log('Helping hand element found:', this.helpingHand);
  }

  initializeAudio() {
    this.backgroundAudio = new Audio('background.mp3');
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.2;
    this.backgroundAudio.preload = 'metadata';

    this.winAudio = new Audio('win.mp3');
    this.winAudio.volume = 0.3;
    this.winAudio.preload = 'metadata';

    this.loseAudio = new Audio('lose.mp3');
    this.loseAudio.volume = 0.3;
    this.loseAudio.preload = 'metadata';
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.rewardBtn.addEventListener('click', () => this.claimReward());
    this.shuffleBtn.addEventListener('click', () => this.manualShuffle());
  }

  showGameContainer() {
    this.gameContainer.classList.remove('hidden');
    this.gameContainer.style.pointerEvents = 'none';
  }

  initializeGrid() {
    this.gameGrid.innerHTML = '';
    this.grid = [];

    this.draggables.forEach((draggable) => draggable.kill());
    this.draggables = [];

    for (let row = 0; row < this.gridRows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        const cell = this.createCell(row, col);
        this.gameGrid.appendChild(cell);
        this.grid[row][col] = {
          element: cell,
          type: this.getRandomProductType(),
          row: row,
          col: col,
        };
      }
    }

    this.updateGridDisplay();
    this.removeInitialMatches();
    this.setupDraggables();
  }

  createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.row = row;
    cell.dataset.col = col;

    cell.addEventListener('click', () => this.onCellClick(row, col));

    return cell;
  }

  getRandomProductType() {
    return this.productTypes[
      Math.floor(Math.random() * this.productTypes.length)
    ];
  }

  getRandomProductTypeAvoidingMatches(row, col) {
    let attempts = 0;
    let newType;

    do {
      newType = this.getRandomProductType();
      attempts++;

      const originalType = this.grid[row][col].type;
      this.grid[row][col].type = newType;

      const matches = this.checkForMatches(row, col);

      if (matches.length === 0) {
        break;
      }

      this.grid[row][col].type = originalType;
    } while (attempts < 10);

    return newType;
  }

  updateGridDisplay() {
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const cellData = this.grid[row][col];
        if (cellData.type) {
          cellData.element.innerHTML = `<img src="${cellData.type}" alt="Product" loading="lazy">`;
        } else {
          cellData.element.innerHTML = '';
        }
      }
    }
  }

  removeInitialMatches() {
    let hasMatches = true;
    while (hasMatches) {
      hasMatches = false;
      for (let row = 0; row < this.gridRows; row++) {
        for (let col = 0; col < this.gridCols; col++) {
          if (this.checkForMatches(row, col).length > 0) {
            this.grid[row][col].type = this.getRandomProductType();
            hasMatches = true;
          }
        }
      }
    }
    this.updateGridDisplay();
  }

  onCellClick(row, col) {
    if (!this.gameActive) return;

    this.updateActivityTime();

    const cell = this.grid[row][col];

    if (this.selectedCell === null) {
      this.selectedCell = cell;
      cell.element.classList.add('selected');
    } else if (this.selectedCell === cell) {
      this.selectedCell.element.classList.remove('selected');
      this.selectedCell = null;
    } else if (this.isAdjacent(this.selectedCell, cell)) {
      this.swapCells(this.selectedCell, cell);
      this.selectedCell.element.classList.remove('selected');
      this.selectedCell = null;
    } else {
      this.selectedCell.element.classList.remove('selected');
      this.selectedCell = cell;
      cell.element.classList.add('selected');
    }
  }

  setupDraggables() {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const cell = this.grid[row][col];
        const draggable = Draggable.create(cell.element, {
          type: 'x,y',
          bounds: this.gameGrid,
          onDragStart: () => this.onDragStart(cell),
          onDrag: () => this.onDrag(cell),
          onDragEnd: () => this.onDragEnd(cell),
          throwProps: false,
          dragResistance: 0.1,
        })[0];

        this.draggables.push(draggable);
      }
    }
  }

  onDragStart(cell) {
    if (!this.gameActive) return false;

    this.updateActivityTime();

    this.dragStartCell = cell;
    cell.element.classList.add('dragging');

    gsap.set(cell.element, { zIndex: 100 });

    return true;
  }

  onDrag(cell) {
    gsap.set(cell.element, {
      scale: 1.05,
      zIndex: 100,
    });
  }

  onDragEnd(cell) {
    if (!this.dragStartCell) return;

    this.updateActivityTime();

    cell.element.classList.remove('dragging');
    gsap.set(cell.element, {
      zIndex: 1,
      scale: 1,
      rotation: 0,
    });

    const targetCell = this.findClosestCell(cell);

    if (targetCell && this.isAdjacent(this.dragStartCell, targetCell)) {
      this.swapCells(this.dragStartCell, targetCell);
    }

    gsap.set(cell.element, {
      x: 0,
      y: 0,
    });

    this.dragStartCell = null;
  }

  findClosestCell(draggedCell) {
    const draggedRect = draggedCell.element.getBoundingClientRect();
    const draggedCenterX = draggedRect.left + draggedRect.width / 2;
    const draggedCenterY = draggedRect.top + draggedRect.height / 2;

    let closestCell = null;
    let minDistance = Infinity;

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const cell = this.grid[row][col];
        if (cell === draggedCell) continue;

        const cellRect = cell.element.getBoundingClientRect();
        const cellCenterX = cellRect.left + cellRect.width / 2;
        const cellCenterY = cellRect.top + cellRect.height / 2;

        const distance = Math.sqrt(
          Math.pow(draggedCenterX - cellCenterX, 2) +
            Math.pow(draggedCenterY - cellCenterY, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestCell = cell;
        }
      }
    }

    return closestCell;
  }

  isAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  swapCells(cell1, cell2) {
    this.updateActivityTime();

    const tempType = cell1.type;
    cell1.type = cell2.type;
    cell2.type = tempType;

    this.updateGridDisplay();

    const matches1 = this.checkForMatches(cell1.row, cell1.col);
    const matches2 = this.checkForMatches(cell2.row, cell2.col);

    if (matches1.length > 0 || matches2.length > 0) {
      this.playWinSound();
      setTimeout(() => this.processMatches(), 100);
    } else {
      this.playLoseSound();
      setTimeout(() => {
        const tempType = cell1.type;
        cell1.type = cell2.type;
        cell2.type = tempType;
        this.updateGridDisplay();
      }, 100);
    }
  }

  checkForMatches(row, col) {
    const matches = [];
    const type = this.grid[row][col].type;

    let left = col;
    while (left >= 0 && this.grid[row][left].type === type) {
      left--;
    }
    left++;

    let right = col;
    while (right < this.gridCols && this.grid[row][right].type === type) {
      right++;
    }

    if (right - left >= 3) {
      for (let c = left; c < right; c++) {
        matches.push({ row: row, col: c });
      }
    }

    let top = row;
    while (top >= 0 && this.grid[top][col].type === type) {
      top--;
    }
    top++;

    let bottom = row;
    while (bottom < this.gridRows && this.grid[bottom][col].type === type) {
      bottom++;
    }

    if (bottom - top >= 3) {
      for (let r = top; r < bottom; r++) {
        matches.push({ row: r, col: col });
      }
    }

    return matches;
  }

  hasValidMoves() {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        if (col < this.gridCols - 1) {
          if (this.wouldCreateMatch(row, col, row, col + 1)) {
            return true;
          }
        }

        if (row < this.gridRows - 1) {
          if (this.wouldCreateMatch(row, col, row + 1, col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  wouldCreateMatch(row1, col1, row2, col2) {
    const temp = this.grid[row1][col1].type;
    this.grid[row1][col1].type = this.grid[row2][col2].type;
    this.grid[row2][col2].type = temp;

    const matches1 = this.checkForMatches(row1, col1);
    const matches2 = this.checkForMatches(row2, col2);
    const hasMatches = matches1.length > 0 || matches2.length > 0;

    this.grid[row2][col2].type = this.grid[row1][col1].type;
    this.grid[row1][col1].type = temp;

    return hasMatches;
  }

  shuffleGrid() {
    const allTypes = [];
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        allTypes.push(this.grid[row][col].type);
      }
    }

    for (let i = allTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTypes[i], allTypes[j]] = [allTypes[j], allTypes[i]];
    }

    let index = 0;
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        this.grid[row][col].type = allTypes[index++];
      }
    }

    this.removeInitialMatches();
    this.updateGridDisplay();
  }

  manualShuffle() {
    if (!this.gameActive) return;
    this.updateActivityTime();
    this.shuffleGrid();
  }

  processMatches() {
    const allMatches = new Set();

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const matches = this.checkForMatches(row, col);
        matches.forEach((match) => {
          allMatches.add(`${match.row}-${match.col}`);
        });
      }
    }

    if (allMatches.size === 0) {
      this.comboLevel = 0;

      if (!this.hasValidMoves()) {
        this.shuffleGrid();
      }

      this.isAnimating = false;
      this.startHintTimerWhenReady();
      return;
    }

    this.isAnimating = true;

    const matchedCells = Array.from(allMatches).map((pos) => {
      const [row, col] = pos.split('-').map(Number);
      return this.grid[row][col];
    });

    matchedCells.forEach((cell, index) => {
      gsap.to(cell.element, {
        scale: 1.3,
        filter: 'brightness(1.5) drop-shadow(0 0 15px rgba(240, 185, 11, 0.8))',
        duration: 0.15,
        ease: 'power2.out',
        delay: index * 0.02,
        onComplete: () => {
          gsap.to(cell.element, {
            scale: 0,
            opacity: 0,
            rotation: 180,
            duration: 0.2,
            ease: 'back.in(1.5)',
            onComplete: () => {
              gsap.set(cell.element, {
                scale: 1,
                opacity: 1,
                rotation: 0,
                filter: 'drop-shadow(0 0 8px rgba(240, 185, 11, 0.4))',
              });
            },
          });
        },
      });
    });

    this.score += allMatches.size * 10;
    this.updateScore();

    this.comboLevel = (this.comboLevel || 0) + 1;

    this.createSimpleParticleEffect(matchedCells);

    if (allMatches.size >= 4) {
      this.createScreenFlash();
    }

    this.showSimpleScorePopup(allMatches.size * 10);

    setTimeout(() => {
      this.removeMatchedCells(Array.from(allMatches));
      this.fillEmptySpaces();
      this.animateNewCells();

      setTimeout(() => this.processMatches(), 200);
    }, 150);
  }

  removeMatchedCells(matchedPositions) {
    matchedPositions.forEach((pos) => {
      const [row, col] = pos.split('-').map(Number);
      this.grid[row][col].type = null;

      this.grid[row][col].element.innerHTML = '';

      this.grid[row][col].recentlyRemoved = true;
    });
  }

  fillEmptySpaces() {
    for (let col = 0; col < this.gridCols; col++) {
      const newColumn = [];

      for (let row = this.gridRows - 1; row >= 0; row--) {
        if (this.grid[row][col].type !== null) {
          newColumn.push(this.grid[row][col].type);
        }
      }

      for (let row = this.gridRows - 1; row >= 0; row--) {
        if (newColumn.length > 0) {
          this.grid[row][col].type = newColumn.shift();
        } else {
          this.grid[row][col].type = this.getRandomProductTypeAvoidingMatches(
            row,
            col
          );

          this.grid[row][col].recentlyRemoved = true;
        }
      }
    }
  }

  animateNewCells() {
    this.updateGridDisplay();

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const cell = this.grid[row][col];

        gsap.set(cell.element, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          filter: 'drop-shadow(0 0 8px rgba(240, 185, 11, 0.4))',
        });

        if (cell.type && cell.recentlyRemoved) {
          gsap.fromTo(
            cell.element,
            {
              opacity: 0,
              scale: 0.8,
              filter: 'drop-shadow(0 0 8px rgba(240, 185, 11, 0.4))',
            },
            {
              opacity: 1,
              scale: 1,
              filter: 'drop-shadow(0 0 8px rgba(240, 185, 11, 0.4))',
              duration: 0.3,
              ease: 'power2.out',
            }
          );

          cell.recentlyRemoved = false;
        }
      }
    }

    this.isAnimating = false;
    this.startHintTimerWhenReady();
  }

  createSimpleParticleEffect(matchedCells) {
    matchedCells.forEach((cell) => {
      const rect = cell.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const particleCount = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: 6px;
          height: 6px;
          background: #f0b90b;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
          left: ${centerX}px;
          top: ${centerY}px;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(240, 185, 11, 0.8);
        `;

        document.body.appendChild(particle);

        const angle = Math.random() * 360 * (Math.PI / 180);
        const distance = 30 + Math.random() * 40;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;

        gsap.to(particle, {
          x: endX - centerX,
          y: endY - centerY,
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          delay: Math.random() * 0.1,
          onComplete: () => {
            if (document.body.contains(particle)) {
              document.body.removeChild(particle);
            }
          },
        });
      }
    });
  }

  createScreenFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(240, 185, 11, 0.3);
      pointer-events: none;
      z-index: 999;
      opacity: 0;
    `;

    document.body.appendChild(flash);

    gsap.to(flash, {
      opacity: 1,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(flash, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            if (document.body.contains(flash)) {
              document.body.removeChild(flash);
            }
          },
        });
      },
    });
  }

  showSimpleScorePopup(points) {
    const popup = document.createElement('div');
    popup.textContent = `+${points}`;
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #f0b90b;
      font-size: 24px;
      font-weight: bold;
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
    `;

    document.body.appendChild(popup);

    gsap.to(popup, {
      opacity: 1,
      y: -20,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(popup, {
          opacity: 0,
          y: -40,
          duration: 0.3,
          delay: 0.2,
          onComplete: () => {
            if (document.body.contains(popup)) {
              document.body.removeChild(popup);
            }
          },
        });
      },
    });
  }

  updateScore() {
    this.scoreElement.textContent = this.score;

    this.scoreElement.classList.add('energetic');

    setTimeout(() => {
      this.scoreElement.classList.remove('energetic');
    }, 600);
  }

  startGame() {
    this.removePageClickListener();

    this.startDialog.classList.add('hidden');
    this.gameContainer.style.pointerEvents = 'auto';
    this.gameActive = true;
    this.score = 0;
    this.timeLeft = 20;
    this.updateScore();
    this.updateTimer();

    this.playBackgroundMusic();

    if (this.helpingHand) {
      this.showHelpingHand();
    }

    this.isAnimating = false;
    this.startHintTimer();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  updateTimer() {
    this.timerElement.textContent = this.timeLeft;

    if (this.timeLeft <= 10) {
      this.timerElement.style.color = '#FFD700';
      this.timerElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';

      this.timerElement.classList.add('energetic');
      setTimeout(() => {
        this.timerElement.classList.remove('energetic');
      }, 300);
    } else {
      this.timerElement.style.color = '#FFD700';
      this.timerElement.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.8)';
    }
  }

  endGame() {
    this.gameActive = false;
    clearInterval(this.timerInterval);
    this.clearHintTimeout();
    this.hideHelpingHand();

    this.stopBackgroundMusic();

    gsap.killTweensOf('*');

    this.finalScoreElement.textContent = this.score;
    this.endDialog.classList.remove('hidden');

    this.addPageClickListener();
  }

  claimReward() {}

  addPageClickListener() {
    this.pageClickListener = (event) => {
      console.log('onAdClicked');
      window.Playable.onAdClicked();
    };
    document.addEventListener('click', this.pageClickListener);
  }

  removePageClickListener() {
    if (this.pageClickListener) {
      document.removeEventListener('click', this.pageClickListener);
      this.pageClickListener = null;
    }
  }

  playBackgroundMusic() {
    if (this.backgroundAudio) {
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio.play().catch((e) => {
        console.log('Background music autoplay prevented:', e);
      });
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
    }
  }

  playWinSound() {
    if (this.winAudio) {
      this.winAudio.currentTime = 0;
      this.winAudio.play().catch((e) => {
        console.log('Win sound play failed:', e);
      });
    }
  }

  playLoseSound() {
    if (this.loseAudio) {
      this.loseAudio.currentTime = 0;
      this.loseAudio.play().catch((e) => {
        console.log('Lose sound play failed:', e);
      });
    }
  }

  showHelpingHand() {
    if (!this.gameActive) {
      console.log('Cannot show helping hand - game not active');
      return;
    }

    console.log('Attempting to show helping hand...');

    if (!this.helpingHand) {
      console.log('ERROR: Helping hand element not found!');
      return;
    }

    const hintMove = this.findHintMove();
    console.log('Hint move found:', hintMove);

    if (hintMove) {
      this.helpingHand.classList.remove('hidden');
      this.startHintAnimation(hintMove);
    } else {
      console.log('No valid hint move found');

      this.testHandAtCell(0, 0);
    }
  }

  startHintAnimation(hintMove) {
    const cell1 = this.grid[hintMove.from.row][hintMove.from.col].element;
    const cell2 = this.grid[hintMove.to.row][hintMove.to.col].element;

    if (!cell1 || !cell2) {
      console.log('ERROR: Cells not found for hint move');
      return;
    }

    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    const startX = rect1.left + rect1.width / 2 - 25;
    const startY = rect1.top + rect1.height / 2 - 15;

    const endX = rect2.left + rect2.width / 2 - 25;
    const endY = rect2.top + rect2.height / 2 - 15;

    gsap.set(this.helpingHand, {
      left: startX + 'px',
      top: startY + 'px',
      position: 'fixed',
      zIndex: 9999,
      scale: 1,
      rotation: 0,
    });

    this.animateHandMovement(startX, startY, endX, endY, hintMove);
  }

  animateHandMovement(startX, startY, endX, endY, hintMove) {
    this.currentHintMove = hintMove;

    gsap.killTweensOf(this.helpingHand);

    const animate = () => {
      if (!this.gameActive || this.helpingHand.classList.contains('hidden')) {
        return;
      }

      gsap.set(this.helpingHand, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      });

      gsap.to(this.helpingHand, {
        x: endX - startX,
        y: endY - startY,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(this.helpingHand, {
            scale: 1.1,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              setTimeout(() => {
                if (
                  this.gameActive &&
                  !this.helpingHand.classList.contains('hidden')
                ) {
                  gsap.to(this.helpingHand, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.in',
                    onComplete: () => {
                      setTimeout(() => {
                        if (
                          this.gameActive &&
                          !this.helpingHand.classList.contains('hidden')
                        ) {
                          animate();
                        }
                      }, 400);
                    },
                  });
                }
              }, 100);
            },
          });
        },
      });
    };

    animate();
  }

  hideHelpingHand() {
    this.helpingHand.classList.add('hidden');
    this.hintShown = false;

    gsap.killTweensOf(this.helpingHand);
  }

  findHintMove() {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        if (col < this.gridCols - 1) {
          if (this.wouldCreateMatch(row, col, row, col + 1)) {
            return { from: { row, col }, to: { row, col: col + 1 } };
          }
        }

        if (row < this.gridRows - 1) {
          if (this.wouldCreateMatch(row, col, row + 1, col)) {
            return { from: { row, col }, to: { row: row + 1, col } };
          }
        }
      }
    }
    return null;
  }

  updateActivityTime() {
    this.lastActivityTime = Date.now();
    this.hideHelpingHand();
    this.clearHintTimeout();
  }

  clearHintTimeout() {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
      this.hintTimeout = null;
    }
  }

  startHintTimerWhenReady() {
    if (this.gameActive && !this.isAnimating) {
      this.startHintTimer();
    }
  }

  startHintTimer() {
    this.clearHintTimeout();
    this.hintTimeout = setTimeout(() => {
      if (this.gameActive && Date.now() - this.lastActivityTime >= 2000) {
        this.showHelpingHand();
      }
    }, 2000);
  }

  testHelpingHand() {
    console.log('Testing helping hand...');
    if (this.helpingHand) {
      this.helpingHand.classList.remove('hidden');
      this.helpingHand.style.left = '200px';
      this.helpingHand.style.top = '200px';
      this.helpingHand.style.position = 'fixed';
      this.helpingHand.style.zIndex = '9999';
      console.log('Helping hand should be visible now at position 200,200');
      console.log('Helping hand classes:', this.helpingHand.className);
    } else {
      console.log('Helping hand element not found!');
    }
  }

  testHandAtCell(row, col) {
    console.log(`Testing hand at cell ${row}, ${col}`);
    if (this.helpingHand && this.grid[row] && this.grid[row][col]) {
      const cell = this.grid[row][col].element;
      const rect = cell.getBoundingClientRect();

      this.helpingHand.classList.remove('hidden');
      this.helpingHand.style.left = rect.left + rect.width / 2 - 30 + 'px';
      this.helpingHand.style.top = rect.top + rect.height / 2 - 20 + 'px';
      this.helpingHand.style.position = 'fixed';
      this.helpingHand.style.zIndex = '9999';

      console.log(`Hand positioned at cell ${row}, ${col}`);
      console.log(
        'Position:',
        this.helpingHand.style.left,
        this.helpingHand.style.top
      );
    } else {
      console.log('Cell or helping hand not found!');
    }
  }

  debugGrid() {
    console.log('Grid state:');
    for (let row = 0; row < this.gridRows; row++) {
      let rowStr = '';
      for (let col = 0; col < this.gridCols; col++) {
        rowStr += this.grid[row][col].type + ' ';
      }
      console.log(`Row ${row}: ${rowStr}`);
    }

    const matches = this.checkForMatches();
    console.log('Current matches:', matches);

    const hintMove = this.findHintMove();
    console.log('Hint move:', hintMove);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.game = new CandyCrushGame();
  }, 100);
});
