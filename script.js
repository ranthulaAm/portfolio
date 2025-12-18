document.addEventListener('DOMContentLoaded', function() {
    class AnimationRunner {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.animationType = canvas.dataset.animationType;
            this.elements = [];
            this.animationFrameId = null;
            this.resize();
            this.init();
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            const parent = this.canvas.parentElement;
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
            this.init();
        }
        init() {
            this.elements = [];
            let numElements;
            const isMobile = window.innerWidth < 768;
            switch (this.animationType) {
                case 'hero':
                    numElements = isMobile ? 25 : 50;
                    for (let i = 0; i < numElements; i++) this.elements.push(new HeroLine(this.canvas));
                    break;
                case 'circles':
                    numElements = isMobile ? 15 : 25;
                    for (let i = 0; i < numElements; i++) this.elements.push(new Circle(this.canvas));
                    break;
                case 'raining-lines':
                    numElements = isMobile ? 40 : 80;
                    for (let i = 0; i < numElements; i++) this.elements.push(new RainingLine(this.canvas));
                    break;
            }
        }
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.elements.forEach(el => {
                el.draw(this.ctx);
                el.update();
            });
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
        start() {
            if (!this.animationFrameId) this.animate();
        }
        stop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }
    class HeroLine { constructor(canvas) { this.canvas = canvas; this.x = Math.random() * this.canvas.width; this.y = Math.random() * this.canvas.height; this.history = [{ x: this.x, y: this.y }]; this.lineWidth = Math.random() * 3.5 + 1.5; this.maxLength = Math.floor(Math.random() * 300 + 200); this.speedX = Math.random() * 2 - 1; this.speedY = Math.random() * 2 - 1; this.life = this.maxLength * 2; this.timer = 0; this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.15})`; } draw(c) { c.strokeStyle = this.color; c.lineWidth = this.lineWidth; c.beginPath(); c.moveTo(this.history[0].x, this.history[0].y); for (const p of this.history) c.lineTo(p.x, p.y); c.stroke(); } update() { this.timer++; if (this.timer < this.life) { this.x += this.speedX + Math.sin(this.timer * 0.02) * 0.8; this.y += this.speedY + Math.cos(this.timer * 0.02) * 0.8; this.history.push({ x: this.x, y: this.y }); if (this.history.length > this.maxLength) this.history.shift(); } else if (this.history.length > 1) { this.history.shift(); } else { this.reset(); } } reset() { this.x = Math.random() * this.canvas.width; this.y = Math.random() * this.canvas.height; this.history = [{ x: this.x, y: this.y }]; this.timer = 0; } }
    class Circle { constructor(c) { this.c = c; this.x = Math.random() * c.width; this.y = Math.random() * c.height; this.r = Math.random() * 100 + 30; this.vx = Math.random() * 0.4 - 0.2; this.vy = Math.random() * 0.4 - 0.2; this.color = `rgba(255,255,255,${Math.random() * 0.15 + 0.05})`; } draw(x) { x.fillStyle = this.color; x.beginPath(); x.arc(this.x, this.y, this.r, 0, Math.PI * 2); x.fill(); } update() { this.x += this.vx; this.y += this.vy; if (this.x < -this.r || this.x > this.c.width + this.r || this.y < -this.r || this.y > this.c.height + this.r) this.reset(); } reset() { this.x = Math.random() * this.c.width; this.y = Math.random() * this.c.height; } }
    class RainingLine { constructor(c) { this.c = c; this.x = Math.random() * c.width; this.y = Math.random() * c.height; this.l = Math.random() * 25 + 15; this.speed = Math.random() * 1.5 + 0.5; this.color = `rgba(255,255,255,${Math.random() * 0.25 + 0.1})`; } draw(x) { x.strokeStyle = this.color; x.lineWidth = 1; x.beginPath(); x.moveTo(this.x, this.y); x.lineTo(this.x, this.y + this.l); x.stroke(); } update() { this.y += this.speed; if (this.y > this.c.height) { this.y = 0 - this.l; this.x = Math.random() * this.c.width; } } }
    const container = document.getElementById('animation-container');
    const heroCanvas = document.getElementById('hero-canvas');
    const sentences = [
        ["Hi!", "I'm Ranthula"],
        ["Bring your ideas", "to life with", "vivid visuals!"]
    ];
    let sentenceIndex = 0;
    let heroAnimationRunner = null;
    async function runAnimationCycle() { container.style.opacity = '1'; const currentSentenceLines = sentences[sentenceIndex]; const createdLineElements = []; if (sentenceIndex === 0) { document.documentElement.style.setProperty('--gradient-opacity', '0.3'); if (heroCanvas) heroCanvas.style.opacity = '0'; if (heroAnimationRunner) heroAnimationRunner.stop(); } else if (sentenceIndex === 1) { if (heroAnimationRunner) heroAnimationRunner.start(); if (heroCanvas) heroCanvas.style.opacity = '1'; setTimeout(() => document.documentElement.style.setProperty('--gradient-opacity', '1'), 100); } for (const lineText of currentSentenceLines) { const lineDiv = document.createElement('div'); lineDiv.className = 'line'; lineDiv.textContent = lineText; const lineFgDiv = document.createElement('div'); lineFgDiv.className = 'line-fg'; lineFgDiv.textContent = lineText; lineDiv.appendChild(lineFgDiv); container.appendChild(lineDiv); createdLineElements.push(lineDiv); await new Promise(resolve => setTimeout(resolve, 50)); lineDiv.style.opacity = '1'; await new Promise(resolve => setTimeout(resolve, 800)); } const pauseDuration = sentenceIndex === 1 ? 9000 : 2000; await new Promise(resolve => setTimeout(resolve, pauseDuration)); for (const el of createdLineElements) { el.style.opacity = '0'; } await new Promise(resolve => setTimeout(resolve, 500)); container.innerHTML = ''; sentenceIndex = (sentenceIndex + 1) % sentences.length; runAnimationCycle(); }

    const portfolioData = [{
        id: 'art1',
        title: "Wukong's Stand",
        description: 'A mythical warrior stands against a rising sun, embodying power and legend.',
        imageUrl: 'img/01.jpg',
        story: "Ever since I was a kid, the legend of the Monkey King amazed me. I wanted to capture that one quiet moment right before the world erupts into battle—a hero, his weapon, and a sky full of impossible promise. This piece is my tribute to that feeling of limitless power.",
        colors: ['rgb(210, 100, 0)', 'rgb(255, 190, 80)']
    }, {
        id: 'art2',
        title: 'Golden Rivalry',
        description: "Anticipation builds for the 'Battle of Gold and Yellow'...",
        imageUrl: 'img/02.jpg',
        story: "This was for a local college's big match, and you could feel the energy in the air. It wasn’t just about the game; it was about pride and history. I tried to bottle that intense, electric moment right before the first ball is bowled, where anything feels possible.",
        colors: ['rgb(140, 20, 20)', 'rgb(255, 190, 40)']
    }, {
        id: 'art3',
        title: 'Stormy Pitch',
        description: 'A lone figure on a desolate pitch under a stormy sky...',
        imageUrl: 'img/03.jpg',
        story: "Every athlete knows this feeling: standing alone against a huge challenge. The world is loud, the pressure is on, but in your head, it's completely silent. This piece is about finding that calm in the middle of the storm and facing what's coming with quiet strength.",
        colors: ['rgb(85, 75, 70)', 'rgb(255, 245, 200)']
    }, {
        id: 'art4',
        title: "Ceylon's Finest",
        description: 'Vibrant product promotion capturing the fresh, natural essence of local cashews.',
        imageUrl: 'img/04.jpg',
        story: "How do you make something taste as good as it looks? That was my goal here. I wanted to create an image that felt fresh, natural, and authentically Sri Lankan. It’s more than just a product; it’s a piece of home, made to look as delicious as it truly is.",
        colors: ['rgb(80, 130, 40)', 'rgb(160, 210, 90)']
    }, {
        id: 'art5',
        title: 'Grand Opening',
        description: 'A dynamic and smoky announcement, celebrating a new beginning with flavor.',
        imageUrl: 'img/05.jpg',
        story: "A new restaurant isn't just a place to eat; it's a dream coming true. I wanted to capture the sizzle, the smoke, and the excitement of that first day. This design is all about building anticipation and making you feel the energy and flavor before you even walk through the door.",
        colors: ['rgb(135, 56, 3)', 'rgb(255, 160, 80)']
    }, {
        id: 'art6',
        title: 'The Wings',
        description: 'An artwork created for real customer',
        imageUrl: 'img/06.jpg',
        story: "I created that artwork for a customer who requested it, successfully turning his idea into a visual representation.",
        colors: ['rgb(251, 64, 64)', 'rgb(131, 3, 3)']
    }];

    const storeGrid = document.getElementById('store-grid');
    const storyModalBackdrop = document.getElementById('story-modal-backdrop');
    const storyModalContent = document.getElementById('story-modal-content');
    const storyModalImg = document.getElementById('story-modal-img');
    const storyModalTitle = document.getElementById('story-modal-title');
    const storyModalText = document.getElementById('story-modal-text');
    const storyModalClose = document.getElementById('story-modal-close');

    function generateProductCards() {
        portfolioData.forEach((item, index) => {
            const cardHTML = `
                <div class="product-card-container scroll-reveal" style="transition-delay: ${index * 100}ms;">
                    <div class="product-card rounded-lg overflow-hidden flex flex-col h-full" data-glow-id="${item.id}" data-item-id="${item.id}">
                        <div class="product-image-wrapper w-full overflow-hidden cursor-pointer" data-src="${item.imageUrl}">
                           <img src="${item.imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/600x600/121212/E0E0E0?text=Image+Not+Found';" alt="${item.title}" class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ease-in-out">
                        </div>
                        <div class="p-6 flex-grow flex flex-col">
                            <h3 class="font-righteous text-2xl mb-2">${item.title}</h3>
                            <p class="text-gray-400 text-sm mb-4 flex-grow">${item.description}</p>
                            <button class="story-button mt-auto w-full text-white font-bold font-righteous py-2 px-4 rounded-full hover:opacity-90 transition-opacity" data-glow-id="${item.id}">Story of the Art</button>
                        </div>
                    </div>
                </div>
            `;
            storeGrid.innerHTML += cardHTML;
        });
    }

    function applyDynamicStyles() {
        let allRules = '';
        portfolioData.forEach(item => {
            if (!item.colors) return;
            const [color1, color2] = item.colors;
            allRules += `
                .product-card[data-glow-id="${item.id}"] .product-image-wrapper {
                    background: linear-gradient(135deg, ${color1}, ${color2});
                }
                .story-button[data-glow-id="${item.id}"] {
                    background: linear-gradient(90deg, ${color1}, ${color2});
                    animation: glow-${item.id} 2.5s ease-in-out infinite;
                }
                .product-card[data-glow-id="${item.id}"]:hover {
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${color1};
                }
                @keyframes glow-${item.id} {
                    0%, 100% { box-shadow: 0 0 8px ${color2}, 0 0 20px ${color1}; }
                    50% { box-shadow: 0 0 16px ${color2}, 0 0 40px ${color1}; }
                }
            `;
        });
        const styleElement = document.createElement("style");
        styleElement.innerHTML = allRules;
        document.head.appendChild(styleElement);
    }

    function apply3DEffects() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const cardContainer = card.closest('.product-card-container');
            if(cardContainer) {
                cardContainer.addEventListener('mousemove', (e) => {
                    const rect = cardContainer.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const { width, height } = rect;
                    const rotateX = (y / height - 0.5) * -15;
                    const rotateY = (x / width - 0.5) * 15;
                    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                cardContainer.addEventListener('mouseleave', () => {
                    card.style.transform = 'rotateX(0) rotateY(0)';
                });
            }
        });
    }

    generateProductCards();
    applyDynamicStyles();
    apply3DEffects();

    // --- MODAL AND STORY TEXT LOGIC ---
    const storyModalImgContainer = document.getElementById('story-modal-img-container');
    let storyAnimationTimeouts = [];
    
    function openStoryModal(item) {
        storyModalTitle.textContent = `The Story Behind "${item.title}"`;
        storyModalText.innerHTML = '';
        storyModalImg.src = item.imageUrl;
        storyModalContent.style.borderColor = item.colors[0] || 'var(--accent-purple)';
        
        const indicator = document.createElement('div');
        indicator.className = 'drag-indicator';
        indicator.innerHTML = '<span class="sub-text">Drag To</span><span class="main-text">Explore</span>';
        storyModalImgContainer.appendChild(indicator);
        
        storyModalImg.style.objectPosition = 'center center';

        storyModalBackdrop.classList.remove('hidden');
        setTimeout(() => {
            storyModalBackdrop.classList.remove('opacity-0');
            storyModalContent.classList.remove('opacity-0', 'scale-95');
            animateStoryText(item.story);
            setupPanningListeners();
        }, 10);
    }

    function closeStoryModal() {
        const indicator = storyModalImgContainer.querySelector('.drag-indicator');
        if (indicator) {
            storyModalImgContainer.removeChild(indicator);
        }

        removePanningListeners();
        storyAnimationTimeouts.forEach(clearTimeout);
        storyAnimationTimeouts = [];
        storyModalContent.classList.add('opacity-0', 'scale-95');
        storyModalBackdrop.classList.add('opacity-0');
        setTimeout(() => {
            storyModalBackdrop.classList.add('hidden');
        }, 300);
    }
    
    function animateStoryText(text) {
        storyModalText.innerHTML = '';
        const characters = text.split('');
        characters.forEach((char, index) => {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            storyModalText.appendChild(span);
            const timeoutId = setTimeout(() => {
                span.classList.add('visible');
            }, index * 20);
            storyAnimationTimeouts.push(timeoutId);
        });
    }

    storeGrid.addEventListener('click', (e) => {
        const storyButton = e.target.closest('.story-button');
        const imageWrapper = e.target.closest('.product-image-wrapper');
        let targetCard = null;
        if (storyButton) {
            targetCard = storyButton.closest('.product-card');
        } else if (imageWrapper) {
            targetCard = imageWrapper.closest('.product-card');
        }
        if (targetCard) {
            const itemId = targetCard.dataset.itemId;
            const itemData = portfolioData.find(item => item.id === itemId);
            if (itemData) {
                openStoryModal(itemData);
            }
        }
    });

    storyModalClose.addEventListener('click', closeStoryModal);
    storyModalBackdrop.addEventListener('click', (e) => {
        if (e.target === storyModalBackdrop) {
            closeStoryModal();
        }
    });
    
    // --- DRAG-TO-MOVE IMAGE LOGIC ---
    let isPanning = false, startX, startY, startObjectX, startObjectY;
    
    function getObjectPosition(element) {
        const style = window.getComputedStyle(element).objectPosition;
        const parts = style.split(' ').map(val => parseFloat(val));
        return { x: parts[0] || 50, y: parts[1] || 50 };
    }

    function onPanStart(e) {
        const isCropped = Math.abs((storyModalImg.naturalWidth / storyModalImg.naturalHeight) - (storyModalImg.clientWidth / storyModalImg.clientHeight)) > 0.02;
        if (!isCropped) return;
        
        e.preventDefault();
        isPanning = true;
        storyModalImgContainer.classList.add('is-panning');

        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = currentX;
        startY = currentY;

        const pos = getObjectPosition(storyModalImg);
        startObjectX = pos.x;
        startObjectY = pos.y;
    }

    function onPanMove(e) {
        if (!isPanning) return;
        e.preventDefault();
        
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const sensitivity = 0.2; 
        let newObjectX = startObjectX - (deltaX * sensitivity);
        let newObjectY = startObjectY - (deltaY * sensitivity);

        newObjectX = Math.max(0, Math.min(100, newObjectX));
        newObjectY = Math.max(0, Math.min(100, newObjectY));

        storyModalImg.style.objectPosition = `${newObjectX}% ${newObjectY}%`;
    }

    function onPanEnd() {
        isPanning = false;
        storyModalImgContainer.classList.remove('is-panning');
    }

    function setupPanningListeners() {
        storyModalImgContainer.addEventListener('touchstart', onPanStart, { passive: false });
        document.addEventListener('touchmove', onPanMove, { passive: false });
        document.addEventListener('touchend', onPanEnd);
        
        storyModalImgContainer.addEventListener('mousedown', onPanStart);
        document.addEventListener('mousemove', onPanMove);
        document.addEventListener('mouseup', onPanEnd);
        document.addEventListener('mouseleave', onPanEnd);
    }

    function removePanningListeners() {
        storyModalImgContainer.removeEventListener('touchstart', onPanStart);
        document.removeEventListener('touchmove', onPanMove);
        document.removeEventListener('touchend', onPanEnd);
        
        storyModalImgContainer.removeEventListener('mousedown', onPanStart);
        document.removeEventListener('mousemove', onPanMove);
        document.removeEventListener('mouseup', onPanEnd);
        document.removeEventListener('mouseleave', onPanEnd);
    }
    
    // --- Rest of the script ---
    const contactImageContainer = document.getElementById('contact-image-container');
    if (contactImageContainer) {
        contactImageContainer.addEventListener('mouseenter', () => {
            contactImageContainer.style.animationPlayState = 'paused';
        });
        contactImageContainer.addEventListener('mousemove', (e) => {
            const rect = contactImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -10;
            const rotateY = (x / width - 0.5) * 10;
            contactImageContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        contactImageContainer.addEventListener('mouseleave', () => {
            contactImageContainer.style.animationPlayState = 'running';
            contactImageContainer.style.transform = '';
        });
    }
    document.querySelectorAll('.section-canvas').forEach(canvas => {
        const runner = new AnimationRunner(canvas);
        if (canvas.id === 'hero-canvas') {
            heroAnimationRunner = runner;
        } else if (canvas) {
            runner.start();
        }
    });
    document.fonts.ready.then(() => {
        runAnimationCycle();
    });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(el);
    });
});
