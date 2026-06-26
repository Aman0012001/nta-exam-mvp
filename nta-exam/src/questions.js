// NTA Physics Questions with Diagrams
export const questions = [
  {
    id: 1,
    subject: "Physics",
    topic: "Laws of Motion",
    question: "A block of mass 5 kg is placed on a frictionless inclined plane of angle 30°. What is the acceleration of the block along the incline? (g = 10 m/s²)",
    options: ["5 m/s²", "4.33 m/s²", "10 m/s²", "2.5 m/s²"],
    answer: 1,
    diagram: {
      type: "inclined-plane",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <polygon points="10,180 250,180 250,80" fill="#e8f4f8" stroke="#2c5f8a" stroke-width="2"/>
        <rect x="155" y="110" width="45" height="35" rx="3" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5" transform="rotate(-20,177,127)"/>
        <text x="173" y="131" fill="white" font-size="10" text-anchor="middle" transform="rotate(-20,177,127)">5 kg</text>
        <path d="M170,130 L170,175" stroke="#e74c3c" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
        <path d="M170,130 L145,155" stroke="#2c5f8a" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow2)"/>
        <text x="180" y="162" fill="#e74c3c" font-size="11">mg</text>
        <text x="125" y="168" fill="#2c5f8a" font-size="11">mg sin30°</text>
        <path d="M230,180 A20,20 0 0,0 250,165" fill="none" stroke="#27ae60" stroke-width="1.5"/>
        <text x="228" y="195" fill="#27ae60" font-size="11">θ = 30°</text>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
          <marker id="arrow2" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2c5f8a"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 2,
    subject: "Physics",
    topic: "Projectile Motion",
    question: "A ball is thrown horizontally from a height of 20 m with a velocity of 10 m/s. What is the horizontal range of the projectile? (g = 10 m/s²)",
    options: ["10 m", "20 m", "30 m", "40 m"],
    answer: 2,
    diagram: {
      type: "projectile",
      svg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <line x1="20" y1="20" x2="20" y2="175" stroke="#555" stroke-width="2"/>
        <line x1="20" y1="175" x2="300" y2="175" stroke="#555" stroke-width="2"/>
        <text x="5" y="185" fill="#555" font-size="10">O</text>
        <line x1="20" y1="50" x2="80" y2="50" stroke="#888" stroke-width="1" stroke-dasharray="5,3"/>
        <text x="22" y="47" fill="#2c5f8a" font-size="10">20 m</text>
        <line x1="20" y1="10" x2="20" y2="50" stroke="#2c5f8a" stroke-width="1.5" stroke-dasharray="4,2"/>
        <circle cx="80" cy="50" r="6" fill="#e74c3c"/>
        <path d="M86,50 L110,50" stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowR)"/>
        <text x="110" y="46" fill="#e74c3c" font-size="10">v₀=10m/s</text>
        <path d="M80,50 Q190,100 240,175" stroke="#27ae60" stroke-width="2" fill="none" stroke-dasharray="6,3"/>
        <circle cx="240" cy="175" r="5" fill="#27ae60"/>
        <line x1="80" y1="180" x2="240" y2="180" stroke="#e67e22" stroke-width="2"/>
        <path d="M80,182 L80,178 M240,182 L240,178" stroke="#e67e22" stroke-width="1.5"/>
        <text x="140" y="195" fill="#e67e22" font-size="11" text-anchor="middle">Range = R</text>
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 3,
    subject: "Physics",
    topic: "Circular Motion",
    question: "A stone of mass 0.5 kg is tied to a string and rotated in a horizontal circle of radius 1 m at a speed of 4 m/s. What is the tension in the string?",
    options: ["4 N", "8 N", "16 N", "2 N"],
    answer: 2,
    diagram: {
      type: "circular-motion",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <circle cx="150" cy="100" r="80" fill="none" stroke="#ddd" stroke-width="1.5" stroke-dasharray="6,4"/>
        <circle cx="150" cy="100" r="5" fill="#555"/>
        <line x1="150" y1="100" x2="230" y2="100" stroke="#2c5f8a" stroke-width="2"/>
        <text x="185" y="92" fill="#2c5f8a" font-size="11">r = 1 m</text>
        <circle cx="230" cy="100" r="10" fill="#e74c3c"/>
        <text x="226" y="104" fill="white" font-size="9">m</text>
        <path d="M230,88 Q260,70 245,50" stroke="#27ae60" stroke-width="1.5" fill="none" marker-end="url(#arrowG)"/>
        <text x="250" y="58" fill="#27ae60" font-size="10">v</text>
        <path d="M220,100 L195,100" stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowRed)"/>
        <text x="183" y="115" fill="#e74c3c" font-size="10">T (tension)</text>
        <defs>
          <marker id="arrowG" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#27ae60"/></marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 4,
    subject: "Physics",
    topic: "Work, Energy & Power",
    question: "A spring with spring constant k = 200 N/m is compressed by 0.1 m. What is the potential energy stored in the spring?",
    options: ["2 J", "1 J", "0.5 J", "20 J"],
    answer: 2,
    diagram: {
      type: "spring",
      svg: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <rect x="10" y="60" width="20" height="40" fill="#888" rx="2"/>
        <path d="M30,80 L50,80 M50,80 L60,65 L70,95 L80,65 L90,95 L100,65 L110,95 L120,65 L130,95 L140,65 L150,80 M150,80 L170,80" stroke="#2c5f8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <rect x="170" y="60" width="30" height="40" fill="#e74c3c" rx="3"/>
        <text x="175" y="84" fill="white" font-size="10">m</text>
        <line x1="100" y1="110" x2="170" y2="110" stroke="#e67e22" stroke-width="1.5"/>
        <path d="M100,113 L100,107 M170,113 L170,107" stroke="#e67e22" stroke-width="1.5"/>
        <text x="130" y="128" fill="#e67e22" font-size="11" text-anchor="middle">x = 0.1 m</text>
        <text x="90" y="48" fill="#2c5f8a" font-size="10" text-anchor="middle">k = 200 N/m</text>
        <text x="185" y="48" fill="#27ae60" font-size="10">E = ½kx²</text>
      </svg>`
    }
  },
  {
    id: 5,
    subject: "Physics",
    topic: "Waves & Sound",
    question: "In the diagram below, which point represents a NODE in a standing wave pattern?",
    options: ["Point A (crest)", "Point B (zero displacement)", "Point C (trough)", "Point D (amplitude)"],
    answer: 2,
    diagram: {
      type: "standing-wave",
      svg: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <line x1="20" y1="80" x2="300" y2="80" stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"/>
        <path d="M20,80 Q60,20 100,80 Q140,140 180,80 Q220,20 260,80 Q280,110 300,80" stroke="#2c5f8a" stroke-width="2.5" fill="none"/>
        <circle cx="20" cy="80" r="5" fill="#e74c3c"/>
        <text x="15" y="98" fill="#e74c3c" font-size="11">B</text>
        <circle cx="100" cy="80" r="5" fill="#e74c3c"/>
        <text x="95" y="98" fill="#e74c3c" font-size="11">B</text>
        <circle cx="180" cy="80" r="5" fill="#e74c3c"/>
        <text x="175" y="98" fill="#e74c3c" font-size="11">B</text>
        <circle cx="60" cy="20" r="5" fill="#27ae60"/>
        <text x="55" y="15" fill="#27ae60" font-size="11">A</text>
        <circle cx="140" cy="140" r="5" fill="#e67e22"/>
        <text x="135" y="155" fill="#e67e22" font-size="11">C</text>
        <circle cx="220" cy="20" r="5" fill="#9b59b6"/>
        <text x="215" y="15" fill="#9b59b6" font-size="11">D</text>
        <text x="160" y="15" fill="#555" font-size="10" text-anchor="middle">Standing Wave</text>
        <text x="30" y="55" fill="#e74c3c" font-size="9">Node</text>
      </svg>`
    }
  },
  {
    id: 6,
    subject: "Physics",
    topic: "Optics",
    question: "A ray of light strikes a plane mirror at an angle of incidence of 35°. What is the angle of reflection?",
    options: ["70°", "35°", "55°", "45°"],
    answer: 2,
    diagram: {
      type: "reflection",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <rect x="10" y="160" width="280" height="12" rx="2" fill="#888"/>
        <line x1="150" y1="10" x2="150" y2="160" stroke="#999" stroke-width="1" stroke-dasharray="5,4"/>
        <text x="155" y="30" fill="#999" font-size="10">Normal</text>
        <line x1="70" y1="50" x2="150" y2="160" stroke="#e74c3c" stroke-width="2.5" marker-end="url(#arrowRed2)"/>
        <line x1="150" y1="160" x2="230" y2="50" stroke="#27ae60" stroke-width="2.5" marker-end="url(#arrowGreen)"/>
        <path d="M150,130 A30,30 0 0,0 125,118" fill="none" stroke="#e74c3c" stroke-width="1.5"/>
        <text x="100" y="130" fill="#e74c3c" font-size="11">35°</text>
        <path d="M150,130 A30,30 0 0,1 175,118" fill="none" stroke="#27ae60" stroke-width="1.5"/>
        <text x="163" y="130" fill="#27ae60" font-size="11">35°</text>
        <text x="50" y="48" fill="#e74c3c" font-size="11">Incident</text>
        <text x="210" y="48" fill="#27ae60" font-size="11">Reflected</text>
        <text x="130" y="185" fill="#888" font-size="10">Plane Mirror</text>
        <defs>
          <marker id="arrowRed2" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#27ae60"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 7,
    subject: "Physics",
    topic: "Electricity",
    question: "In the circuit shown, two resistors R₁ = 4Ω and R₂ = 6Ω are connected in parallel across a 12V battery. What is the total current from the battery?",
    options: ["2 A", "3 A", "5 A", "1 A"],
    answer: 3,
    diagram: {
      type: "circuit",
      svg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <rect x="15" y="70" width="30" height="40" rx="4" fill="#f0f0f0" stroke="#555" stroke-width="2"/>
        <line x1="20" y1="80" x2="40" y2="80" stroke="#e74c3c" stroke-width="1.5"/>
        <line x1="20" y1="100" x2="40" y2="100" stroke="#000" stroke-width="1.5"/>
        <text x="21" y="92" fill="#555" font-size="9">12V</text>
        <line x1="15" y1="80" x2="15" y2="40" stroke="#333" stroke-width="2"/>
        <line x1="15" y1="40" x2="280" y2="40" stroke="#333" stroke-width="2"/>
        <line x1="280" y1="40" x2="280" y2="70" stroke="#333" stroke-width="2"/>
        <line x1="250" y1="70" x2="310" y2="70" stroke="#333" stroke-width="1.5"/>
        <rect x="254" y="70" width="50" height="20" rx="3" fill="#fff8e1" stroke="#e67e22" stroke-width="1.5"/>
        <text x="272" y="84" fill="#e67e22" font-size="10">R₁=4Ω</text>
        <line x1="250" y1="100" x2="310" y2="100" stroke="#333" stroke-width="1.5"/>
        <rect x="254" y="100" width="50" height="20" rx="3" fill="#e8f8f5" stroke="#27ae60" stroke-width="1.5"/>
        <text x="272" y="114" fill="#27ae60" font-size="10">R₂=6Ω</text>
        <line x1="280" y1="120" x2="280" y2="140" stroke="#333" stroke-width="2"/>
        <line x1="15" y1="100" x2="15" y2="140" stroke="#333" stroke-width="2"/>
        <line x1="15" y1="140" x2="280" y2="140" stroke="#333" stroke-width="2"/>
        <text x="100" y="58" fill="#333" font-size="10">I (total current)</text>
        <path d="M80,40 L110,40" stroke="#333" stroke-width="1.5" marker-end="url(#arrowI)"/>
        <defs>
          <marker id="arrowI" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#333"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 8,
    subject: "Physics",
    topic: "Magnetism",
    question: "A current-carrying conductor is placed in a magnetic field as shown. Using Fleming's Left Hand Rule, in which direction is the force on the conductor?",
    options: ["Upward (↑)", "Downward (↓)", "Into the page (⊗)", "Out of the page (⊙)"],
    answer: 1,
    diagram: {
      type: "magnetic-force",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <rect x="30" y="30" width="240" height="140" rx="5" fill="#f0f8ff" stroke="#2c5f8a" stroke-width="1.5"/>
        <text x="150" y="20" fill="#2c5f8a" font-size="11" text-anchor="middle">B (Magnetic Field) →</text>
        ${Array.from({length:4}, (_,r) => Array.from({length:6}, (_,c) =>
          `<text x="${55+c*38}" y="${60+r*33}" fill="#2c5f8a" font-size="14" text-anchor="middle">→</text>`
        ).join('')).join('')}
        <rect x="120" y="70" width="60" height="60" rx="3" fill="#e74c3c" opacity="0.9"/>
        <text x="150" y="105" fill="white" font-size="11" text-anchor="middle">I →</text>
        <text x="150" y="117" fill="white" font-size="9" text-anchor="middle">conductor</text>
        <path d="M150,65 L150,45" stroke="#27ae60" stroke-width="3" marker-end="url(#arrowUp)"/>
        <text x="158" y="52" fill="#27ae60" font-size="11">F ↑</text>
        <defs>
          <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto"><path d="M0,6 L4,0 L8,6 z" fill="#27ae60"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 9,
    subject: "Physics",
    topic: "Thermodynamics",
    question: "In the P-V diagram shown, which process represents an ISOTHERMAL expansion?",
    options: ["Curve A (steep hyperbola)", "Line B (vertical)", "Line C (horizontal)", "Curve D (parabola)"],
    answer: 1,
    diagram: {
      type: "pv-diagram",
      svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <line x1="40" y1="20" x2="40" y2="175" stroke="#333" stroke-width="2" marker-end="url(#axisArrow)"/>
        <line x1="40" y1="175" x2="285" y2="175" stroke="#333" stroke-width="2" marker-end="url(#axisArrow2)"/>
        <text x="20" y="15" fill="#333" font-size="11">P</text>
        <text x="280" y="190" fill="#333" font-size="11">V</text>
        <path d="M60,50 Q100,80 200,160" stroke="#e74c3c" stroke-width="2.5" fill="none"/>
        <text x="200" y="145" fill="#e74c3c" font-size="11">A</text>
        <line x1="130" y1="40" x2="130" y2="160" stroke="#27ae60" stroke-width="2.5"/>
        <text x="135" y="50" fill="#27ae60" font-size="11">B</text>
        <line x1="60" y1="100" x2="230" y2="100" stroke="#e67e22" stroke-width="2.5"/>
        <text x="230" y="96" fill="#e67e22" font-size="11">C</text>
        <path d="M60,160 Q130,100 240,60" stroke="#9b59b6" stroke-width="2.5" fill="none" stroke-dasharray="7,3"/>
        <text x="240" y="58" fill="#9b59b6" font-size="11">D</text>
        <text x="160" y="200" fill="#555" font-size="10" text-anchor="middle">P-V Diagram</text>
        <defs>
          <marker id="axisArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker>
          <marker id="axisArrow2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 10,
    subject: "Physics",
    topic: "Modern Physics",
    question: "In the photoelectric effect diagram, which quantity does 'W' (the y-intercept when extended) represent?",
    options: ["Maximum kinetic energy", "Work function (threshold energy)", "Planck's constant", "Stopping potential"],
    answer: 2,
    diagram: {
      type: "photoelectric",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <line x1="50" y1="20" x2="50" y2="175" stroke="#333" stroke-width="2" marker-end="url(#axPE)"/>
        <line x1="20" y1="140" x2="270" y2="140" stroke="#333" stroke-width="2" marker-end="url(#axPE2)"/>
        <text x="28" y="15" fill="#333" font-size="11">KE_max</text>
        <text x="265" y="155" fill="#333" font-size="11">ν</text>
        <line x1="140" y1="140" x2="250" y2="60" stroke="#e74c3c" stroke-width="2.5" marker-end="url(#lineArrow)"/>
        <line x1="50" y1="175" x2="140" y2="140" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3"/>
        <circle cx="140" cy="140" r="4" fill="#e74c3c"/>
        <text x="142" y="157" fill="#e74c3c" font-size="10">ν₀ (threshold)</text>
        <line x1="50" y1="175" x2="50" y2="140" stroke="none"/>
        <line x1="35" y1="175" x2="65" y2="175" stroke="#9b59b6" stroke-width="2"/>
        <text x="12" y="179" fill="#9b59b6" font-size="11">-W</text>
        <path d="M47,140 L47,175" stroke="#9b59b6" stroke-width="2" stroke-dasharray="3,2"/>
        <text x="55" y="108" fill="#9b59b6" font-size="11">Work</text>
        <text x="55" y="120" fill="#9b59b6" font-size="11">Function</text>
        <text x="225" y="75" fill="#e74c3c" font-size="11">slope = h</text>
        <defs>
          <marker id="axPE" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker>
          <marker id="axPE2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker>
          <marker id="lineArrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 11,
    subject: "Physics",
    topic: "Gravitation",
    question: "Two objects of masses M and m are separated by distance r. If the distance is doubled, the gravitational force becomes:",
    options: ["Doubled", "Halved", "One-fourth", "Four times"],
    answer: 3,
    diagram: {
      type: "gravitation",
      svg: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <circle cx="60" cy="70" r="28" fill="#3498db" opacity="0.85"/>
        <text x="60" y="74" fill="white" font-size="14" text-anchor="middle" font-weight="bold">M</text>
        <circle cx="255" cy="70" r="18" fill="#e74c3c" opacity="0.85"/>
        <text x="255" y="74" fill="white" font-size="13" text-anchor="middle" font-weight="bold">m</text>
        <line x1="90" y1="70" x2="237" y2="70" stroke="#555" stroke-width="1.5" stroke-dasharray="5,3"/>
        <path d="M90,65 L72,65" stroke="#3498db" stroke-width="2" marker-end="url(#arrBlue)"/>
        <path d="M237,65 L255,65" stroke="#e74c3c" stroke-width="2" marker-end="url(#arrRed)"/>
        <text x="162" y="62" fill="#555" font-size="11" text-anchor="middle">r</text>
        <text x="162" y="100" fill="#27ae60" font-size="11" text-anchor="middle">F = GMm / r²</text>
        <text x="162" y="120" fill="#9b59b6" font-size="10" text-anchor="middle">If r → 2r, then F → F/4</text>
        <defs>
          <marker id="arrBlue" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3498db"/></marker>
          <marker id="arrRed" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 12,
    subject: "Physics",
    topic: "Fluid Mechanics",
    question: "In Bernoulli's principle, as shown in the diagram, which section has the highest velocity?",
    options: ["Section A (wide pipe)", "Section B (narrow constriction)", "Both are equal", "Cannot be determined"],
    answer: 2,
    diagram: {
      type: "bernoulli",
      svg: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <path d="M20,50 L100,50 L130,80 L190,80 L220,50 L300,50" stroke="#2c5f8a" stroke-width="2" fill="none"/>
        <path d="M20,110 L100,110 L130,100 L190,100 L220,110 L300,110" stroke="#2c5f8a" stroke-width="2" fill="none"/>
        <path d="M20,50 L20,110" stroke="#2c5f8a" stroke-width="2"/>
        <path d="M300,50 L300,110" stroke="#2c5f8a" stroke-width="2"/>
        <path d="M130,80 L190,80 L190,100 L130,100 Z" fill="#d6eaf8" opacity="0.5"/>
        <path d="M30,80 L75,80" stroke="#27ae60" stroke-width="2" marker-end="url(#arrF1)"/>
        <path d="M140,90 L180,90" stroke="#e74c3c" stroke-width="2.5" marker-end="url(#arrF2)"/>
        <path d="M235,80 L275,80" stroke="#27ae60" stroke-width="2" marker-end="url(#arrF3)"/>
        <text x="30" y="45" fill="#2c5f8a" font-size="11">A</text>
        <text x="155" y="72" fill="#e74c3c" font-size="11">B</text>
        <text x="265" y="45" fill="#2c5f8a" font-size="11">A</text>
        <text x="40" y="145" fill="#27ae60" font-size="10">v low, P high</text>
        <text x="130" y="125" fill="#e74c3c" font-size="10">v HIGH, P low</text>
        <defs>
          <marker id="arrF1" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#27ae60"/></marker>
          <marker id="arrF2" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
          <marker id="arrF3" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#27ae60"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 13,
    subject: "Physics",
    topic: "Simple Harmonic Motion",
    question: "At which position in the SHM diagram does the particle have maximum kinetic energy?",
    options: ["At the extreme positions (A or -A)", "At the mean position (O)", "At any random position", "At quarter amplitude"],
    answer: 2,
    diagram: {
      type: "shm",
      svg: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <line x1="30" y1="80" x2="290" y2="80" stroke="#555" stroke-width="2" marker-end="url(#axSHM)"/>
        <circle cx="30" cy="80" r="8" fill="#e74c3c" opacity="0.8"/>
        <text x="22" y="100" fill="#e74c3c" font-size="10">-A</text>
        <circle cx="160" cy="80" r="10" fill="#27ae60"/>
        <text x="155" y="100" fill="#27ae60" font-size="10">O</text>
        <text x="148" y="115" fill="#27ae60" font-size="9">KE = max</text>
        <circle cx="290" cy="80" r="8" fill="#e74c3c" opacity="0.8"/>
        <text x="286" y="100" fill="#e74c3c" font-size="10">+A</text>
        <path d="M160,20 Q200,20 200,80" stroke="#9b59b6" stroke-width="1" fill="none" stroke-dasharray="3,2"/>
        <path d="M20,20 L20,80 L300,80" stroke="none"/>
        <path d="M160,70 L160,50" stroke="#27ae60" stroke-width="2" marker-end="url(#arrSHM)"/>
        <text x="165" y="52" fill="#27ae60" font-size="10">Max KE</text>
        <text x="20" y="65" fill="#e74c3c" font-size="9">PE=max</text>
        <text x="270" y="65" fill="#e74c3c" font-size="9">PE=max</text>
        <text x="160" y="18" fill="#555" font-size="10" text-anchor="middle">Simple Harmonic Motion</text>
        <defs>
          <marker id="axSHM" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#555"/></marker>
          <marker id="arrSHM" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto"><path d="M0,6 L4,0 L8,6 z" fill="#27ae60"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 14,
    subject: "Physics",
    topic: "Nuclear Physics",
    question: "In the nuclear fission diagram, U-235 + n → ? The total number of neutrons released per fission that sustain the chain reaction is:",
    options: ["1", "2", "3", "4"],
    answer: 3,
    diagram: {
      type: "nuclear-fission",
      svg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="11">
        <circle cx="80" cy="90" r="30" fill="#3498db" opacity="0.8"/>
        <text x="80" y="86" fill="white" font-size="10" text-anchor="middle">U-235</text>
        <text x="80" y="98" fill="white" font-size="9" text-anchor="middle">92 protons</text>
        <circle cx="30" cy="90" r="8" fill="#e67e22"/>
        <text x="30" y="94" fill="white" font-size="8" text-anchor="middle">n</text>
        <path d="M40,90 L50,90" stroke="#333" stroke-width="1.5" marker-end="url(#arrN)"/>
        <circle cx="155" cy="90" r="35" fill="#9b59b6" opacity="0.7" stroke-dasharray="5,3" stroke="#555" stroke-width="2"/>
        <text x="155" y="88" fill="white" font-size="9" text-anchor="middle">Compound</text>
        <text x="155" y="100" fill="white" font-size="9" text-anchor="middle">Nucleus</text>
        <path d="M112,90 L120,90" stroke="#333" stroke-width="1.5" marker-end="url(#arrN2)"/>
        <circle cx="240" cy="55" r="20" fill="#e74c3c" opacity="0.8"/>
        <text x="240" y="58" fill="white" font-size="9" text-anchor="middle">Ba-141</text>
        <circle cx="240" cy="130" r="18" fill="#27ae60" opacity="0.8"/>
        <text x="240" y="133" fill="white" font-size="9" text-anchor="middle">Kr-92</text>
        <circle cx="290" cy="35" r="7" fill="#e67e22"/>
        <text x="290" y="39" fill="white" font-size="8" text-anchor="middle">n</text>
        <circle cx="295" cy="65" r="7" fill="#e67e22"/>
        <text x="295" y="69" fill="white" font-size="8" text-anchor="middle">n</text>
        <circle cx="290" cy="145" r="7" fill="#e67e22"/>
        <text x="290" y="149" fill="white" font-size="8" text-anchor="middle">n</text>
        <text x="280" y="95" fill="#e67e22" font-size="11">3n</text>
        <path d="M190,90 L260,70" stroke="#e67e22" stroke-width="1.5" stroke-dasharray="4,2"/>
        <path d="M190,90 L260,120" stroke="#e67e22" stroke-width="1.5" stroke-dasharray="4,2"/>
        <defs>
          <marker id="arrN" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#333"/></marker>
          <marker id="arrN2" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#333"/></marker>
        </defs>
      </svg>`
    }
  },
  {
    id: 15,
    subject: "Physics",
    topic: "Electrostatics",
    question: "Looking at the electric field lines diagram, at which point is the electric field strength the STRONGEST?",
    options: ["Point P (sparse field lines)", "Point Q (dense field lines)", "Both P and Q are equal", "Field is zero everywhere"],
    answer: 2,
    diagram: {
      type: "electric-field",
      svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="12">
        <circle cx="80" cy="90" r="22" fill="#e74c3c" opacity="0.85"/>
        <text x="80" y="94" fill="white" font-size="14" text-anchor="middle">+</text>
        ${[0,45,90,135,180,225,270,315].map(a => {
          const rad = a * Math.PI / 180;
          const x1 = 80 + 25 * Math.cos(rad);
          const y1 = 90 + 25 * Math.sin(rad);
          const x2 = 80 + 70 * Math.cos(rad);
          const y2 = 90 + 70 * Math.sin(rad);
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#e74c3c" stroke-width="1.5" marker-end="url(#arrEF)"/>`;
        }).join('')}
        <circle cx="75" cy="55" r="5" fill="#3498db"/>
        <text x="64" y="50" fill="#3498db" font-size="10">P</text>
        <circle cx="104" cy="66" r="5" fill="#27ae60"/>
        <text x="108" y="63" fill="#27ae60" font-size="10">Q</text>
        <text x="85" y="170" fill="#555" font-size="10" text-anchor="middle">Electric Field Lines (+ charge)</text>
        <defs>
          <marker id="arrEF" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e74c3c"/></marker>
        </defs>
      </svg>`
    }
  },
  // Questions 16-100: auto-generated Physics questions
  ...Array.from({ length: 85 }, (_, i) => {
    const id = i + 16;
    const topics = [
      "Mechanics", "Thermodynamics", "Optics", "Electromagnetism",
      "Waves", "Modern Physics", "Nuclear Physics", "Fluid Dynamics",
      "Rotational Motion", "Gravitation"
    ];
    const topic = topics[i % topics.length];
    return {
      id,
      subject: "Physics",
      topic,
      question: `Physics Mock Q${id} (${topic}): A system undergoes a process described by physical law in unit ${id}. What is the resulting physical quantity if the input parameter is doubled?`,
      options: [
        `It remains unchanged`,
        `It doubles (×2)`,
        `It quadruples (×4)`,
        `It becomes half (÷2)`
      ],
      answer: 2,
      diagram: null
    };
  })
];
