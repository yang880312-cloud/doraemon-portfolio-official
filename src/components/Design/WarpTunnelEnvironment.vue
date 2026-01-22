<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let animationId = null
let resizeHandler = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  let width, height, centerX, centerY

  const stars = []
  const numStars = 800
  const speedBase = 2

  // Resize handler
  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    if(canvas) {
        canvas.width = width
        canvas.height = height
    }
    centerX = width / 2
    centerY = height / 2
  }

  // Assign to module-level variable for cleanup
  resizeHandler = resize

  window.addEventListener('resize', resize)
  resize()

  // Star class
  class Star {
    constructor() {
      this.init()
    }

    init() {
      this.x = (Math.random() - 0.5) * width * 2
      this.y = (Math.random() - 0.5) * height * 2
      this.z = Math.random() * width
      this.pz = this.z // Previous z
      this.color = this.randomColor()
    }

    randomColor() {
      // Cyberpunk/Time-machine palette: Cyan, Magenta, Electric Blue, White
      const colors = ['#00ffff', '#ff00ff', '#ffffff', '#60efff', '#dd00ff']
      return colors[Math.floor(Math.random() * colors.length)]
    }

    update() {
      // Move star closer (decrease z)
      this.z -= speedBase * 5 // Warp speed

      // Reset if passed screen
      if (this.z < 1) {
        this.init()
        this.z = width
        this.pz = this.z
      }
    }

    draw() {
      const sx = (this.x / this.z) * width + centerX
      const sy = (this.y / this.z) * height + centerY

      const r = (1 - this.z / width) * 4 // Size grows as it gets closer

      const psx = (this.x / this.pz) * width + centerX
      const psy = (this.y / this.pz) * height + centerY

      this.pz = this.z

      // Draw trail (Warp streak)
      ctx.beginPath()
      ctx.moveTo(psx, psy)
      ctx.lineTo(sx, sy)
      ctx.strokeStyle = this.color
      ctx.lineWidth = r
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  // Initialize stars
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star())
  }

  // Animation Loop
  const animate = () => {
    // Semi-transparent black clear for trail effect (optional, maybe too messy for clean look, let's use full clear for crisp lines)
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    // ctx.fillRect(0, 0, width, height)
    ctx.clearRect(0, 0, width, height)

    // Center glow (The Vortex)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 1.5)
    gradient.addColorStop(0, '#0f0529') // Deep cosmic center
    gradient.addColorStop(1, '#000000') // Outer Dark
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    stars.forEach(star => {
      star.update()
      star.draw()
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="warp-tunnel-container">
    <canvas ref="canvasRef" class="warp-canvas"></canvas>
    <div class="vignette"></div>
    <!-- Grid Overlay for "Digital" feel -->
    <div class="cyber-grid"></div>
  </div>
</template>

<style scoped>
.warp-tunnel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: black;
}

.warp-canvas {
  display: block;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 40%, #000 120%);
  pointer-events: none;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle, #000 0%, transparent 80%);
  opacity: 0.5;
  pointer-events: none;
}
</style>
