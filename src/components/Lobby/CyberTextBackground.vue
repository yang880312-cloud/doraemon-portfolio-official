<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { centerKeyword, bigKeywords, backgroundKeywords } from '@/data/lobbyKeywords'

const canvasRef = ref(null)
let ctx = null
let animationFrame = null
let particles = []

const mouse = { x: -5000, y: -5000 }
const width = ref(0)
const height = ref(0)

// Physics Config (Floaty Space Feel)
const MOUSE_RADIUS = 300
// Increased Force significantly to ensure interaction is felt even with slow particles
const MOUSE_FORCE = 3.0
const DAMPING = 0.98

class Particle {
  constructor({ text, x, y, tier }) {
    this.text = text
    this.x = x
    this.y = y

    this.tier = tier // 'center', 'big', 'bg'

    // Rotation: Random 0-360 degrees for that "Zero-G Space Debris" feel
    this.angle = (Math.random() * Math.PI * 2)

    if (tier === 'center') {
      this.fontSize = 80
      this.font = `900 ${this.fontSize}px "Inter", "Arial Black", sans-serif`
      this.color = '#ffffff'
      this.alpha = 1.0
      this.angle = 0
      this.rotationSpeed = 0
      this.vx = 0
      this.vy = 0
      this.offsetY = -180 // MOVED UP drastically to clear the door
    } else if (tier === 'big') {
      this.fontSize = Math.random() * 40 + 60 // 60-100px
      this.font = `900 ${this.fontSize}px "Inter", sans-serif`
      this.color = '#d1d5db' // Gray-300
      this.alpha = 0.9
      // Slower drift for big items (Massive feel)
      this.vx = (Math.random() - 0.5) * 0.15
      this.vy = (Math.random() - 0.5) * 0.15
      this.rotationSpeed = (Math.random() - 0.5) * 0.0005
    } else {
      // Background (Dense but optimized)
      this.fontSize = Math.random() * 5 + 10 // 10-15px
      this.font = `400 ${this.fontSize}px "JetBrains Mono", monospace`
      this.color = '#6b7280' // Gray-500
      this.alpha = 0.25
      // Very slow drift for background (Atmospheric)
      this.vx = (Math.random() - 0.5) * 0.08
      this.vy = (Math.random() - 0.5) * 0.08
      this.rotationSpeed = (Math.random() - 0.5) * 0.001
    }
  }

  update() {
    if (this.tier === 'center') {
        // Force Position (Top Center) with strong pull
        this.x += (width.value/2 - this.x) * 0.1
        this.y += (height.value/2 + this.offsetY - this.y) * 0.1
        return
    }

    // 1. Mouse Interaction (Repulsion)
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS

      // Repulsion Strength
      const push = (this.tier === 'big') ? 8 : 15
      this.vx -= forceDirectionX * force * MOUSE_FORCE * push * 0.05
      this.vy -= forceDirectionY * force * MOUSE_FORCE * push * 0.05
    }

    // 2. Friction/Damping
    this.vx *= DAMPING
    this.vy *= DAMPING

    // 3. Move
    this.x += this.vx
    this.y += this.vy
    this.angle += this.rotationSpeed

    // 4. Wrap
    if (this.x < -100) this.x = width.value + 100
    if (this.x > width.value + 100) this.x = -100
    if (this.y < -100) this.y = height.value + 100
    if (this.y > height.value + 100) this.y = -100
  }

  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)

    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.font = this.font
    ctx.fillText(this.text, 0, 0)

    ctx.restore()
  }
}

function init() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value

  // PERFORMANCE FIX: Cap DPR at 2
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width.value = window.innerWidth
  height.value = window.innerHeight

  canvas.width = width.value * dpr
  canvas.height = height.value * dpr
  canvas.style.width = `${width.value}px`
  canvas.style.height = `${height.value}px`

  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  createParticles()
}

function createParticles() {
  particles = []
  const isMobile = width.value < 768

  // 1. Background Layer
  // Optimized count for performance (balance between 150 and 40)
  const countBG = isMobile ? 40 : 90
  for (let i = 0; i < countBG; i++) {
     const text = backgroundKeywords[Math.floor(Math.random() * backgroundKeywords.length)]
     particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 'bg'
     }))
  }

  // 2. Big Floating Words (Increased quantity as requested)
  // Ensure we cycle through ALL big keywords
  const countBig = Math.max(bigKeywords.length, isMobile ? 5 : 12)
  for (let i = 0; i < countBig; i++) {
     const text = bigKeywords[i % bigKeywords.length]
     particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 'big'
     }))
  }

  // 3. The CENTERPIECE
  particles.push(new Particle({
      text: centerKeyword,
      x: width.value / 2,
      y: height.value / 2,
      tier: 'center'
  }))
}

function animate() {
  ctx.clearRect(0, 0, width.value, height.value)
  particles.forEach(p => {
    p.update()
    p.draw()
  })
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  window.addEventListener('resize', init)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', init)
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 z-0 pointer-events-auto"></canvas>
</template>
