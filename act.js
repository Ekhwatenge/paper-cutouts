const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min

  if (float) {
    return val
  }

  return Math.floor(val)
}

const colors = [
	334, // red
	35, // orange
	54, // yellow
	159, // green
	264 // purple
]

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
	
	return array
}

class NewCharacter {
	constructor(el) {
		this.width = 600
		this.height = 800
		this.size = random(65, 120)
		
		this.x = this.width / 2
    this.y = this.height / 2
		
		/* Colors */
		this.colors = shuffleArray(colors)
		
		this.shapeIndex = random(0, 2)
		this.bodyType = this.shapeIndex === 0 ? 'trapezium' : 'circle'
		
		this.svg = SVG()
			.addTo(el)
			.size(this.width, this.height)
			.viewbox(0, 0, this.width, this.height)
	}
	
	get bgHue() {
		return this.colors[0]
	}
	
	get headHue() {
		return this.colors[1]
	}
	
	get bodyHue() {
		return this.colors[2]
	}
	
	createPolygon(points, posX, posY, size) {
		const angleStep = (Math.PI * 2) / points;
		const polygon = []
		
		for (let i = 0; i <= points; i++) {
			const pull = random(0.85, 1, true)
			const x = posX + Math.cos(i * angleStep) * (size * pull)
			const y = posY + Math.sin(i * angleStep) * (size * pull)
			polygon.push({x, y})
		}
		
		return polygon.map(({ x, y }) => {
			return `${x},${y}`
		}).join(' ')
	}
	
	createTrapezium() {
		const xStartDisplacementL = random(10, 30)
		const xEndDisplacementL = random(10, 30)
		const points = [
			[this.x - random(10, 30), this.y - random(50, 60)],
			[this.x + random(10, 30), this.y - random(50, 60)],
			[this.x + random(120, 180), this.y + random(120, 180)],
			[this.x - random(120, 180), this.y + random(120, 180)]
		]
		
		return points.map((coords) => {
			return `${coords[0]},${coords[1]}`
		}).join(' ')
	}
	
	drawBg() {
		const fill = `hsl(${this.bgHue}deg, 70%, 50%)`
		this.svg.rect(this.width, this.height).fill(fill)
	}
	
	drawLimb(side, params) {
		const x = side === 'left' ? this.x - random(...params.xStart) : this.x + random(...params.xStart)
		const y = this.y + random(...params.yStart)
		const xEnd = side === 'left' ? this.x - random(...params.xEnd) : this.x + random(...params.xEnd)
		const yEnd = this.y + random(...params.yEnd)
		const width = random(7, 12)
		
		this.svg.line(x, y, xEnd, yEnd).stroke({ width, linecap: 'round' }).attr({ stroke: '#000' })
	}
	
	drawArms() {
		const arm = {
			xStart: this.bodyType === 'trapezium' ? [30, 60] : [60, 80],
			xEnd: [120, 200],
			yStart: [-40, 30],
			yEnd: [-20, 70]
		}
		
		const leg = {
			xStart: [30, 60],
			xEnd: [40, 100],
			yStart: [110, 130],
			yEnd: [230, 320]
		}
		
		this.drawLimb('left', arm)
		this.drawLimb('right', arm)
		this.drawLimb('left', leg)
		this.drawLimb('right', leg)
	}
	
	drawEyes() {
		let d = random(6, 20)
		let xDisplacement = random(15, 50)
		let x = this.x - xDisplacement
		let y = this.y - random(105, 120)
		this.svg.circle(d).move(x, y)
		
		d = random(7, 25)
		x = this.x + xDisplacement
		this.svg.circle(d).move(x, y)
	}
	
	drawMouth() {
		const points = [
			[this.x - random(15, 30), this.y - random(50, 75)],
			[this.x - random(0, 10), this.y - random(50, 60)],
			[this.x + random(0, 10), this.y - random(50, 60)],
			[this.x + random(15, 30), this.y - random(50, 75)]
		]
		const width = random(4, 9)
		
		this.svg.polyline(points).stroke({ width, linecap: 'round' }).attr({ stroke: '#000' }).fill('rgba(0, 0, 0, 0)')
	}
	
	drawHead() {
		const numPoints = random(8, 16)
		const color = `hsl(${this.headHue}deg, 70%, 50%)`
		
		this.svg.polygon(this.createPolygon(numPoints, this.x, 300, this.size)).attr({ fill: color })
	}
	
	drawBody() {
		const color = `hsl(${this.bodyHue}deg, 70%, 50%)`
		let shape
		
		if (this.bodyType === 'trapezium') {
			shape = this.createTrapezium()
		} else {
			const numPoints = random(8, 16)
			const y = random(420, 450)
			const size = this.size * random(0.9, 2, true)
			shape = this.createPolygon(numPoints, this.x, y, size)
		}
		
		this.svg.polygon(shape).attr({ fill: color })
	}
	
	draw() {
		this.drawBg()
		this.drawBody()
		this.drawHead()
		this.drawArms()
		this.drawEyes()
		this.drawMouth()
	}
}

for(i = 0; i < 6; i++) {
	const char = new NewCharacter('body')
	char.draw()
}


