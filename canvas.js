let over = false
let player1 = []
let player2 = []
let turn = 'black'
let width = 600
let lineNum = 19
let padding = width / lineNum / 2

function drawBoard () {
	let element = document.getElementById('canvas')
	let cxt = element.getContext('2d')
	cxt.clearRect(0, 0, element.width, element.height)

	cxt.scale(2, 2)
	cxt.strokeStyle = '#000'
	cxt.lineWidth = 1

	let start = padding
	for (let i = 0; i <= lineNum; i++) {
		cxt.beginPath()
		cxt.moveTo(start, padding)
		cxt.lineTo(start, width - padding)
		cxt.stroke()

		cxt.beginPath()
		cxt.moveTo(padding, start)
		cxt.lineTo(width - padding, start)
		cxt.stroke()

		start = (i + 1) * (width / lineNum) + padding
	}
}

function getStyles (obj) { //兼容FF，IE10; IE9及以下未测试
	return document.defaultView.getComputedStyle(obj)
}

function getCanvasPos (canvas, e) { //获取鼠标在canvas上的坐标  
    var rect = canvas.getBoundingClientRect()
    var leftB = parseInt(getStyles(canvas).borderLeftWidth)//获取的是样式，需要转换为数值
    var topB = parseInt(getStyles(canvas).borderTopWidth)
    return {   
	    x: (e.clientX - rect.left) - leftB,  
	    y: (e.clientY - rect.top) - topB 
	}
}

function checkPlaceholder (indexX, indexY) {
	let arr1 = player1.slice(0)
	let arr2 = player2.slice(0)
	let arr = arr1.concat(arr2)
	for (let i in arr) {
		let item = arr[i]
		if (item[2] === indexX && item[3] === indexY) {
			return false
		}
	}

	return true
}

function checkWin (turn) {
	let player = turn === 'black' ? player2.slice(0) : player1.slice(0)
	let lastPoint = player[player.length - 1]

	let leftArray = []
	let rightArray = []

	let upArray = []
	let downArray = []

	let leftUpArray = []
	let rightDownArray = []

	let leftDownArray = []
	let rightUpArray = []

	for (let n = 0; n < 4; n++) {
		for (let i = 0; i <= player.length - 2; i++) {
			let item = player[i]
			// 横线赢算法
			if (lastPoint[2] - n - 1 == item[2] && lastPoint[3] === item[3]) {
				leftArray.push(item)
			}
			if (lastPoint[2] + n + 1 == item[2] && lastPoint[3] === item[3]) {
				rightArray.push(item)
			}
			// 竖线赢算法
			if (lastPoint[2] === item[2] && lastPoint[3] - n - 1 == item[3]) {
				upArray.push(item)
			}
			if (lastPoint[2] === item[2] && lastPoint[3] + n + 1 == item[3]) {
				downArray.push(item)
			}
			// 正斜线算法
			if (lastPoint[2] - n - 1  == item[2] && lastPoint[3] - n - 1 == item[3]) {
				leftUpArray.push(item)
			}
			if (lastPoint[2] + n + 1  == item[2] && lastPoint[3] + n + 1 == item[3]) {
				rightDownArray.push(item)
			}
			// 反斜线算法
			if (lastPoint[2] - n - 1  == item[2] && lastPoint[3] + n + 1 == item[3]) {
				leftDownArray.push(item)
			}
			if (lastPoint[2] + n + 1  == item[2] && lastPoint[3] - n - 1 == item[3]) {
				rightUpArray.push(item)
			}
		}
	}

	let lastPointX = lastPoint[2]
	let lastPointY = lastPoint[3]
	let leftNum = getPointNum(leftArray.sort(compare(2, false)), lastPointX, 0, 0)
	let rightNum = getPointNum(rightArray.sort(compare(2, true)), lastPointX, 1, 0)
	let upNum = getPointNum(upArray.sort(compare(3, false)), lastPointY, 0, 1)
	let downNum = getPointNum(downArray.sort(compare(2, true)), lastPointY, 1, 1)
	let leftUpNum = getPointNum(leftUpArray.sort(compare(2, false)), lastPointX, 0, 0)
	let rightDownNum = getPointNum(rightDownArray.sort(compare(2, true)), lastPointX, 1, 0)
	let leftDownNum = getPointNum(leftDownArray.sort(compare(2, false)), lastPointX, 0, 0)
	let rightUpNum = getPointNum(rightUpArray.sort(compare(2, true)), lastPointX, 1, 0)
	if (leftNum + rightNum >= 4 || upNum + downNum >= 4 || 
		leftUpNum + rightDownNum >= 4 || leftDownNum + rightUpNum >= 4) {
		return true
	}
	return false
}

/*
	array 传入数组
	lastPoint 比较点index，x坐标或者Y坐标
	direction1 横向方向 0往左或往上 1往右或往下
	direction2 竖向方向 0比较x坐标 1比较y坐标 对应上面lastpoint需传入对应坐标
	*/
function getPointNum (array, lastPoint, direction1, direction2) {
	let num = 0

	for (let i in array) {
		let item = array[i]
		
		let checkDirection2 = direction2 === 0 ? item[2] : item[3]
		let checkDirection1 = direction1 === 0 ? lastPoint - parseInt(i) - 1 : lastPoint + parseInt(i) + 1

		if (checkDirection2 === checkDirection1) {
			num++
		} else {
			break
		}
	}

	return num
}

function compare (item, oppo) {
	return function (a, b) {
		let v1 = a[item]
		let v2 = b[item]
		return oppo ? v1 - v2 : v2 - v1
	}
}

function draw (e) {
	if (over) {
		return
	}
    var c = document.getElementById('canvas')

    let pos = getCanvasPos(c, e)
    let nearlyPoint = getNearlyPoint(pos.x, pos.y)
    // console.log(nearlyPoint[0], nearlyPoint[1])
    let chessX = nearlyPoint[0]
    let chessY = nearlyPoint[1]
    if (checkPlaceholder(nearlyPoint[2], nearlyPoint[3]) && chessX && chessY) {
    	gogo(chessX, chessY, turn)
	    if (turn === 'black') {
	    	player1.push(nearlyPoint)
	    	turn = 'white'
	    } else {
	    	player2.push(nearlyPoint)
	    	turn = 'black'
	    }

	    if (checkWin(turn)) {
	    	console.log(`${turn === 'black' ? 'white' : 'black'} Win`)
	    	over = true
	    }
    }
}

function getNearlyPoint (x, y) {
	let returnX, indexX, returnY, indexY
	for (let i = 0; i <= lineNum; i++) {
		let v = (i * (width / lineNum) + padding).toFixed(3)
		let v1 = ((i + 1) * (width / lineNum) + padding).toFixed(3)

		if (x >= v && x <= v1) {
			if (x - v < (width / lineNum + padding) / 3) {
				returnX = v
				indexX = i + 1
			} else {
				returnX = v1
				indexX = i + 2
			}
		}

		if (y >= v && y <= v1) {
			if (y - v < (width / lineNum + padding) / 3) {
				returnY = v
				indexY = i + 1
			} else {
				returnY = v1
				indexY = i + 2
			}
		}

		if (returnX && returnY) {
			break
		}
	}
	return [returnX, returnY, indexX, indexY]
}

function gogo (x, y, chessType) {
	let c = document.getElementById('canvas')
	let cxt = c.getContext('2d')

    cxt.beginPath()
    cxt.arc(x, y, padding, 0, Math.PI * 2, true)
    cxt.closePath()

    let grd = cxt.createRadialGradient(x - 1, y, padding, x + 3, y - 3, padding / 20)
    if (chessType === 'black') {
    	grd.addColorStop(0, 'black')
		grd.addColorStop(1, 'white')
    } else {
    	grd.addColorStop(0, '#d1d1d1')
		grd.addColorStop(1, '#f9f9f9')
    }

	cxt.fillStyle = grd
	cxt.fill()
}

function reset () {
	let element = document.getElementById('canvas')
	let cxt = element.getContext('2d')
	cxt.scale(0.5, 0.5)
	over = false
	player1 = []
	player2 = []
	turn = 'black'
	drawBoard()
}

function ai () {
	let p1 = []
	let p2 = []
	let p3 = []
	let p4 = []
	let p5 = []

	let me = player2.slice(0)

	// 先判断本方是否可以直接赢算法
	for (let j = 0; j <= me.length - 2; j++) {
		let basePoint = me[j]

		let horizontal = []
		let vertical = []
		let oblique = []
		let opposeOblique = []

	}
}

drawBoard()