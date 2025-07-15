// 粒子爆炸效果系统

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.start();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.ctx = this.canvas.getContext('2d');
        
        // 将canvas添加到粒子容器中
        const container = document.getElementById('particles-container');
        if (container) {
            container.appendChild(this.canvas);
        }
        
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // 鼠标移动时创建粒子
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.1) { // 10%概率创建粒子
                this.createParticle(e.clientX, e.clientY, 'mouse');
            }
        });

        // 点击时创建爆炸效果
        document.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
        });
    }

    createParticle(x, y, type = 'default') {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01,
            size: Math.random() * 4 + 2,
            color: this.getParticleColor(type),
            type: type
        };

        this.particles.push(particle);
    }

    createExplosion(x, y) {
        // 创建多个粒子形成爆炸效果
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = Math.random() * 6 + 2;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: Math.random() * 0.03 + 0.02,
                size: Math.random() * 6 + 3,
                color: this.getExplosionColor(),
                type: 'explosion'
            };

            this.particles.push(particle);
        }
    }

    getParticleColor(type) {
        switch (type) {
            case 'mouse':
                return `hsl(${Math.random() * 60 + 15}, 100%, 60%)`; // 橙色到黄色
            case 'explosion':
                return this.getExplosionColor();
            default:
                return `hsl(${Math.random() * 30 + 15}, 80%, 50%)`; // 橙红色
        }
    }

    getExplosionColor() {
        const colors = [
            '#FF4500', // 橙红色
            '#FFD700', // 金黄色
            '#DC143C', // 深红色
            '#FF6347', // 番茄红
            '#FFA500'  // 橙色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 重力效果
            particle.vy += 0.1;
            
            // 空气阻力
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // 更新生命值
            particle.life -= particle.decay;
            
            // 移除死亡的粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const particle of this.particles) {
            this.ctx.save();
            
            // 设置透明度
            this.ctx.globalAlpha = particle.life;
            
            // 设置颜色
            this.ctx.fillStyle = particle.color;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加发光效果
            if (particle.type === 'explosion') {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = particle.color;
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
        
        // 定期创建背景粒子
        this.backgroundParticleInterval = setInterval(() => {
            if (this.particles.length < 50) { // 限制粒子数量
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.createParticle(x, y, 'background');
            }
        }, 2000);
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.backgroundParticleInterval) {
            clearInterval(this.backgroundParticleInterval);
        }
    }

    // 创建特殊效果
    createFirework(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 8 + 4;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 5 + 2,
                color: this.getExplosionColor(),
                type: 'firework'
            };

            this.particles.push(particle);
        }
    }

    // 创建文字爆炸效果
    createTextExplosion(text, x, y) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
        
        // 在文字周围创建粒子
        for (let i = 0; i < 10; i++) {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            this.createParticle(x + offsetX, y + offsetY, 'text');
        }
    }
}

// 初始化粒子系统
let particleSystem = null;

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        particleSystem = new ParticleSystem();
    });
} else {
    particleSystem = new ParticleSystem();
}

// 暴露给全局使用
window.ParticleSystem = ParticleSystem;
window.createExplosion = (x, y) => {
    if (particleSystem) {
        particleSystem.createExplosion(x, y);
    }
};

window.createFirework = (x, y) => {
    if (particleSystem) {
        particleSystem.createFirework(x, y);
    }
};

// 页面可见性控制
document.addEventListener('visibilitychange', () => {
    if (particleSystem) {
        if (document.hidden) {
            particleSystem.stop();
        } else {
            particleSystem.start();
        }
    }
});

console.log('💥 粒子系统已加载完成！'); 