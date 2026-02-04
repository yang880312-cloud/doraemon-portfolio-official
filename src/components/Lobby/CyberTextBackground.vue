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
const MOUSE_FORCE = 1.5 // Gentler push
const DAMPING = 0.95 // Less friction = more drift

class Particle {
  constructor({ text, x, y, tier }) {
    this.text = text
    this.x = x
    this.y = y
    // Zero-G Drift velocity
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5

    this.tier = tier // 'center', 'big', 'bg'

    // Rotation: Random 0-360 degrees for that "Zero-G Space Debris" feel
    this.angle = (Math.random() * Math.PI * 2)
    this.rotationSpeed = (Math.random() - 0.5) * 0.002 // Slow spin

    if (tier === 'center') {
      this.fontSize = 80 // Fixed large size
      this.font = `900 ${this.fontSize}px "Inter", "Arial Black", sans-serif`
      this.color = '#ffffff'
      this.alpha = 1.0
      this.angle = 0 // Center is STABLE
      this.rotationSpeed = 0
      this.vx = 0
      this.vy = 0
    } else if (tier === 'big') {
      this.fontSize = Math.random() * 40 + 60 // 60-100px
      this.font = `900 ${this.fontSize}px "Inter", sans-serif`
      this.color = '#f3f4f6' // Almost white
      this.alpha = 0.8
    } else {
      // Background (Dense)
      this.fontSize = Math.random() * 8 + 12 // 12-20px
      this.font = `400 ${this.fontSize}px "JetBrains Mono", monospace`
      this.color = '#9ca3af' // Gray-400
      this.alpha = 0.25 // Requested 0.25
    }
  }

  update() {
    if (this.tier === 'center') {
        // Center force correction (Always return to middle)
        this.x += (width.value/2 - this.x) * 0.1
        this.y += (height.value/2 - this.y) * 0.1
        return
    }

    // 1. Mouse Interaction
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS

      const push = (this.tier === 'big') ? 5 : 20 // Heavy things move less
      this.vx -= forceDirectionX * force * MOUSE_FORCE * push * 0.05
      this.vy -= forceDirectionY * force * MOUSE_FORCE * push * 0.05
    }

    // 2. Zero-G Drift (Wrap around screen)
    // No spring force to origin! They float freely.
    this.x += this.vx
    this.y += this.vy
    this.angle += this.rotationSpeed

    // 3. Screen Wrapping
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

  const dpr = window.devicePixelRatio || 1
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

  // 1. Background Layer (High Density)
  const countBG = isMobile ? 30 : 150 // Dense!
  for (let i = 0; i < countBG; i++) {
     const text = backgroundKeywords[Math.floor(Math.random() * backgroundKeywords.length)]
     particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 'bg'
     }))
  }

  // 2. Big Floating Words
  bigKeywords.forEach(text => {
      particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 'big'
      }))
  })

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
