<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let ctx = null
let particles = []
let animationId = null
let mouseX = 0
let mouseY = 0

// Particle Class
class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 2 + 0.5 // Varied size
    this.speedX = Math.random() * 2 - 1 // Drift left/right
    this.speedY = Math.random() * 2 - 1 // Drift up/down
    this.life = 1.0 // Opacity
    this.decay = Math.random() * 0.03 + 0.01 // Fade speed

    // Magic Colors: White, Cyan, Purple, Gold
    const colors = ['#ffffff', '#a855f7', '#22d3ee', '#fcd34d']
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.life -= this.decay
    this.size *= 0.95 // Shrink over time
  }

  draw() {
    if (!ctx) return
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0
  }
}

function spawnParticles(e) {
  mouseX = e.clientX
  mouseY = e.clientY

  // Spawn multiple particles for dense trail
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(mouseX, mouseY))
  }
}

function animate() {
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw()

    // Remove dead particles
    if (particles[i].life <= 0 || particles[i].size <= 0.1) {
      particles.splice(i, 1)
      i--
    }
  }

  // Connect particles (Constellation effect - Optional, kept subtle)
  // ... (Omitting to keep it purely "Dusty")

  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', spawnParticles)
    animate()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', spawnParticles)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
  ></canvas>
</template>

<style scoped>
/* No extra styles needed */
</style>
