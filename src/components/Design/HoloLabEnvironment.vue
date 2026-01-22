<script setup>
// Pure visual component
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none perspective-container">

    <!-- 1. 3D Perspective Grid Floor -->
    <!-- Infinite scrolling grid effect -->
    <div class="absolute inset-0 perspective-wrapper">
        <div class="grid-floor"></div>
        <div class="grid-horizon"></div>
    </div>

    <!-- 2. Ambient Particles (CSS) -->
    <div class="particles">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
    </div>

    <!-- 3. Ambient Scanner Light (Top-down beam) -->
    <div class="scanner-beam"></div>

    <!-- Vignette for depth focus -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] z-10"></div>
  </div>
</template>

<style scoped>
.perspective-container {
    perspective: 1000px;
}

.perspective-wrapper {
    transform-style: preserve-3d;
}

/* --- THE GRID FLOOR --- */
.grid-floor {
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 200%;
    height: 100%;
    background-image:
        linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: rotateX(60deg);
    transform-origin: 50% 0%;
    animation: grid-scroll 20s linear infinite;
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
}

.grid-horizon {
    position: absolute;
    top: 40%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

@keyframes grid-scroll {
    0% { transform: rotateX(60deg) translateY(0); }
    100% { transform: rotateX(60deg) translateY(40px); }
}

/* --- PARTICLES --- */
.particle {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0;
    animation: float-rise 8s infinite ease-in-out;
}
.p1 { width: 2px; height: 2px; left: 10%; bottom: 0; animation-delay: 0s; }
.p2 { width: 3px; height: 3px; left: 30%; bottom: -10%; animation-delay: 2s; }
.p3 { width: 1px; height: 1px; left: 60%; bottom: -20%; animation-delay: 4s; }
.p4 { width: 2px; height: 2px; left: 80%; bottom: -5%; animation-delay: 1s; }
.p5 { width: 4px; height: 4px; left: 50%; bottom: -15%; animation-delay: 5s; }

@keyframes float-rise {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    20% { opacity: 0.4; }
    80% { opacity: 0.2; }
    100% { transform: translateY(-100vh) scale(0); opacity: 0; }
}

/* --- SCANNER BEAM --- */
.scanner-beam {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20%;
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent);
    animation: scan-down 10s ease-in-out infinite;
    pointer-events: none;
}

@keyframes scan-down {
    0%, 100% { transform: translateY(-100%); opacity: 0; }
    50% { transform: translateY(100vh); opacity: 1; }
}
</style>
