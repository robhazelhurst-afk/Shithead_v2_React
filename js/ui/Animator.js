// Animator.js - Animation engine for card movements and effects

export class Animator {
    constructor() {
        this.activeAnimations = new Set();
    }

    // Easing functions
    static easings = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeOutElastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
        easeOutBounce: t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        }
    };

    /**
     * Animate an element from current position to target position
     */
    animate(element, from, to, duration = 500, easing = 'easeOutCubic') {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const easingFn = Animator.easings[easing] || Animator.easings.linear;
            
            // Set initial transform
            this.applyTransform(element, from);
            
            const animationId = Symbol('animation');
            this.activeAnimations.add(animationId);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easingFn(progress);
                
                // Interpolate values
                const current = {
                    x: this.lerp(from.x || 0, to.x || 0, easedProgress),
                    y: this.lerp(from.y || 0, to.y || 0, easedProgress),
                    rotation: this.lerp(from.rotation || 0, to.rotation || 0, easedProgress),
                    scale: this.lerp(from.scale || 1, to.scale || 1, easedProgress),
                    opacity: this.lerp(from.opacity ?? 1, to.opacity ?? 1, easedProgress)
                };
                
                this.applyTransform(element, current);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.activeAnimations.delete(animationId);
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    /**
     * Move card from one position to another
     */
    async moveCard(cardElement, fromPos, toPos, duration = 500, easing = 'easeOutCubic') {
        const from = {
            x: fromPos.x,
            y: fromPos.y,
            rotation: 0,
            scale: 1
        };
        
        const to = {
            x: toPos.x,
            y: toPos.y,
            rotation: 0,
            scale: 1
        };
        
        await this.animate(cardElement, from, to, duration, easing);
    }

    /**
     * Flip a card (face-down to face-up or vice versa)
     */
    async flipCard(cardElement, isFaceUp, duration = 400) {
        // Scale to 0 width (mid-flip), change content, scale back
        await this.animate(cardElement, 
            { scale: 1, rotation: 0 }, 
            { scale: 0.1, rotation: 90 }, 
            duration / 2, 
            'easeInCubic'
        );
        
        // Callback to change card face would go here
        // (handled by caller)
        
        await this.animate(cardElement, 
            { scale: 0.1, rotation: 90 }, 
            { scale: 1, rotation: 0 }, 
            duration / 2, 
            'easeOutCubic'
        );
    }

    /**
     * Play animation - card slides to discard pile
     */
    async playCard(cardElement, fromPos, discardPos) {
        const from = {
            x: fromPos.x,
            y: fromPos.y,
            rotation: 0,
            scale: 1
        };
        
        // Add slight arc
        const midX = (fromPos.x + discardPos.x) / 2;
        const midY = Math.min(fromPos.y, discardPos.y) - 30;
        
        // Animate to mid-point
        await this.animate(cardElement, from, 
            { x: midX, y: midY, rotation: 5, scale: 1.1 }, 
            200, 'easeOutQuad'
        );
        
        // Animate to discard
        await this.animate(cardElement, 
            { x: midX, y: midY, rotation: 5, scale: 1.1 }, 
            { x: discardPos.x, y: discardPos.y, rotation: 0, scale: 1 }, 
            200, 'easeInQuad'
        );
    }

    /**
     * Burn animation - cards disappear with effect
     */
    async burnPile(cardElements) {
        const promises = cardElements.map((element, index) => {
            return this.animate(element, 
                { scale: 1, rotation: 0, opacity: 1 }, 
                { scale: 1.5, rotation: 360, opacity: 0 }, 
                600, 
                'easeInCubic'
            );
        });
        
        await Promise.all(promises);
    }

    /**
     * Celebration animation - card bounces
     */
    async celebrate(cardElement) {
        await this.animate(cardElement, 
            { scale: 1, y: 0 }, 
            { scale: 1.2, y: -20 }, 
            300, 
            'easeOutBounce'
        );
        
        await this.animate(cardElement, 
            { scale: 1.2, y: -20 }, 
            { scale: 1, y: 0 }, 
            200, 
            'easeInQuad'
        );
    }

    /**
     * Shake animation - for invalid plays
     */
    async shake(element, intensity = 10) {
        const original = { x: 0, y: 0 };
        
        for (let i = 0; i < 4; i++) {
            await this.animate(element, 
                { x: -intensity }, 
                { x: intensity }, 
                50, 
                'linear'
            );
        }
        
        await this.animate(element, 
            { x: intensity }, 
            { x: 0 }, 
            50, 
            'linear'
        );
    }

    /**
     * Pulse animation - highlight effect
     */
    async pulse(element, count = 1) {
        for (let i = 0; i < count; i++) {
            await this.animate(element, 
                { scale: 1 }, 
                { scale: 1.1 }, 
                150, 
                'easeInOutQuad'
            );
            
            await this.animate(element, 
                { scale: 1.1 }, 
                { scale: 1 }, 
                150, 
                'easeInOutQuad'
            );
        }
    }

    /**
     * Apply transform to element
     */
    applyTransform(element, transform) {
        const x = transform.x || 0;
        const y = transform.y || 0;
        const rotation = transform.rotation || 0;
        const scale = transform.scale || 1;
        
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
        
        if (transform.opacity !== undefined) {
            element.style.opacity = transform.opacity;
        }
    }

    /**
     * Linear interpolation
     */
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cancel all active animations
     */
    cancelAll() {
        this.activeAnimations.clear();
    }

    /**
     * Get element's current position
     */
    getPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height
        };
    }
}
