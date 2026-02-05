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

// Config
const MOUSE_RADIUS = 300
const MOUSE_FORCE = 2.0

class Particle {
  constructor({ text, x, y, tier }) {
    this.text = text
    this.x = x
    this.y = y
    this.tier = tier // 'center', 'big', 'bg'

    // 1. ANGLE: STRICTLY HORIZONTAL (0)
    this.angle = 0

    if (tier === 'center') {
      this.fontSize = 80
      this.font = `900 ${this.fontSize}px "Inter", "Arial Black", sans-serif`
      this.color = '#ffffff'
      this.alpha = 1.0
      this.vx = 0
      this.vy = 0
      this.offsetY = -280 // Slightly lower than -320 to connect with door better
    } else if (tier === 'big') {
      this.fontSize = Math.random() * 30 + 50 // 50-80px (Normalized)
      this.font = `900 ${this.fontSize}px "Inter", sans-serif`
      this.color = '#e5e7eb' // Gray-200
      this.alpha = 0.8
      // Horizontal Stream Speed
      this.vx = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1)
      this.vy = (Math.random() - 0.5) * 0.05 // Tiny vertical wobble
    } else {
      // Background (Stream)
      this.fontSize = Math.random() * 4 + 12 // 12-16px
      this.font = `400 ${this.fontSize}px "JetBrains Mono", monospace`
      this.color = '#6b7280' // Gray-500
      this.alpha = 0.3
      // Consistent Slow Drift
      this.vx = (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1)
      this.vy = 0
    }
  }

  update() {
    if (this.tier === 'center') {
        this.x += (width.value/2 - this.x) * 0.1
        this.y += (height.value/2 + this.offsetY - this.y) * 0.1
        return
    }

    // 1. Mouse Interaction (Repulsion covers X and Y for organic feel)
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < MOUSE_RADIUS) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS

      const push = (this.tier === 'big') ? 10 : 20
      this.vx -= forceDirectionX * force * MOUSE_FORCE * push * 0.01 // Reduced impact on velocity

      // Direct position push for immediate feedback without ruining velocity
      this.x -= forceDirectionX * force * 2
      this.y -= forceDirectionY * force * 2
    }

    // 2. Velocity Limit
    // Keep 'Big' particles moving but not too fast
    if (this.tier === 'big') {
         if (Math.abs(this.vx) > 1.5) this.vx *= 0.95
         // Return to horizontal lane
         this.vy *= 0.95
    }

    // 3. Move
    this.x += this.vx
    this.y += this.vy

    // 4. Wrap (Stream feel)
    const margin = 200
    if (this.x < -margin) this.x = width.value + margin
    if (this.x > width.value + margin) this.x = -margin

    // Vertical wrap just in case pushed out
    if (this.y < -100) this.y = height.value + 100
    if (this.y > height.value + 100) this.y = -100
  }

  draw() {
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.font = this.font
    ctx.fillText(this.text, this.x, this.y)
  }
}

function init() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
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

  // 1. Background Horizontal Lanes
  // We place them in specific Y-lanes to avoid clutter? No, random Y is fine if density is low.
  const countBG = isMobile ? 40 : 80
  for (let i = 0; i < countBG; i++) {
     const text = backgroundKeywords[Math.floor(Math.random() * backgroundKeywords.length)]
     particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        tier: 'bg'
     }))
  }

  // 2. Big Words
  // Spread them out vertically to avoid clumping
  const countBig = bigKeywords.length
  // Divide screen into vertical slices for initial placement
  const slice = height.value / (countBig + 2)

  bigKeywords.forEach((text, i) => {
      particles.push(new Particle({
        text,
        x: Math.random() * width.value,
        // Distribute Y to ensure visual coverage
        y: slice * (i + 1) + (Math.random() - 0.5) * 50,
        tier: 'big'
      }))
  })

  // 3. Center
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
