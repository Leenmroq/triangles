document.getElementById('triangle-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const sideA = parseFloat(document.getElementById('side-a').value);
    const sideB = parseFloat(document.getElementById('side-b').value);
    const sideC = parseFloat(document.getElementById('side-c').value);

    // Check for valid positive numbers and triangle inequality theorem
    if (isNaN(sideA) || isNaN(sideB) || isNaN(sideC) || sideA <= 0 || sideB <= 0 || sideC <= 0 || sideA + sideB <= sideC || sideB + sideC <= sideA || sideC + sideA <= sideB) {
        alert("يرجى إدخال قيم صحيحة موجبة لجميع الأضلاع التي تكون مثلثًا صحيحًا.");
        document.getElementById('triangle-type').innerHTML = "ثلاثي غير صحيح";
        drawTriangle(sideA, sideB, sideC, 0, 0, 0); // Call with dummy angles to display "Invalid Triangle"
        return;
    }

    let triangleType = "";

    if (sideA === sideB && sideB === sideC) {
        triangleType = "مثلث متساوي الأضلاع";
    } else if (sideA === sideB || sideB === sideC || sideA === sideC) {
        triangleType = "مثلث متساوي الساقين";
    } else {
        triangleType = "مثلث مختلف الأضلاع";
    }

    // Calculate angles using the Law of Cosines
    const angleA = Math.acos((sideB ** 2 + sideC ** 2 - sideA ** 2) / (2 * sideB * sideC)) * (180 / Math.PI);
    const angleB = Math.acos((sideA ** 2 + sideC ** 2 - sideB ** 2) / (2 * sideA * sideC)) * (180 / Math.PI);
    const angleC = 180 - angleA - angleB;

    let angleClassification = "";
    if (angleA === 90 || angleB === 90 || angleC === 90) {
        angleClassification = "مثلث قائم الزاوية";
    } else if (angleA > 90 || angleB > 90 || angleC > 90) {
        angleClassification = "مثلث منفرج الزاوية";
    } else {
        angleClassification = "مثلث حاد الزوايا";
    }

    // Update the text content with the triangle type, angles, and classification
    const resultElement = document.getElementById('triangle-type');
    resultElement.innerHTML = `
    المثلث هو: ${triangleType}<br>
    الزوايا: الزاوية الأولى = ${angleA.toFixed(2)}°, الزاوية الثانية = ${angleB.toFixed(2)}°, الزاوية الثالثة = ${angleC.toFixed(2)}°<br>
    تصنيف الزوايا: ${angleClassification}
`;


    // Draw the triangle with sides and angles
    drawTriangle(sideA, sideB, sideC, angleA, angleB, angleC);
});

// Function to draw the triangle
function drawTriangle(a, b, c, angleA, angleB, angleC) {
    const svg = document.getElementById('triangle-svg');
    svg.innerHTML = ""; // Clear previous triangle

    // Check if the triangle is valid (triangle inequality theorem)
    if (a + b <= c || b + c <= a || c + a <= b) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 150);
        text.setAttribute("y", 150);
        text.setAttribute("text-anchor", "middle");
        text.textContent = "ثلاثي غير صحيح";
        svg.appendChild(text);
        return;
    }

    // Scale factor calculation
    const maxSize = 23; // Max size allowed for the triangle
    const minSize = 23;  // Min size for the triangle
    const trianglePerimeter = a + b + c;
    const scaleFactor = Math.min(maxSize / trianglePerimeter, minSize / trianglePerimeter);

    // Define triangle points with scaling
    const scale = scaleFactor * 20; // Adjust scale for fitting the diagram
    const A = { x: 50, y: 250 };
    const B = { x: A.x + c * scale, y: A.y };
    const C = {
        x: B.x - a * Math.cos((angleB * Math.PI) / 180) * scale,
        y: B.y - a * Math.sin((angleB * Math.PI) / 180) * scale
    };

    // Draw the triangle
    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.setAttribute("points", `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`);
    triangle.setAttribute("fill", "none");
    triangle.setAttribute("stroke", "#a73939");
    triangle.setAttribute("stroke-width", "2");
    svg.appendChild(triangle);

    // Label the triangle
    labelTriangle(svg, A, B, C, a, b, c, angleA, angleB, angleC);
}

function midpoint(P1, P2) {
    return {
        x: (P1.x + P2.x) / 2,
        y: (P1.y + P2.y) / 2
    };
}

function addLabel(svg, x, y, textContent) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.textContent = textContent;
    svg.appendChild(text);
}

function labelTriangle(svg, A, B, C, a, b, c, angleA, angleB, angleC) {
    const scale = 50;

    const sideA = midpoint(B, C);
    const sideB = midpoint(A, C);
    const sideC = midpoint(A, B);

    addLabel(svg, sideA.x, sideA.y, `ضلع: ${a}`);
    addLabel(svg, sideB.x, sideB.y, `ضلع: ${b}`);
    addLabel(svg, sideC.x, sideC.y, `ضلع: ${c}`);

    const angleOffset = 20;
    addLabel(svg, A.x - angleOffset, A.y + angleOffset, `${angleA.toFixed(2)}°`);
    addLabel(svg, B.x + angleOffset, B.y + angleOffset, `${angleB.toFixed(2)}°`);
    addLabel(svg, C.x - angleOffset, C.y - angleOffset, `${angleC.toFixed(2)}°`);
}
