const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc1: './assets/background/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imgSrc1: './assets/decorations/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc1: './assets/Martial Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imgSrc1: './assets/Martial Hero/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imgSrc1: './assets/Martial Hero/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc1: './assets/Martial Hero/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc1: './assets/Martial Hero/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc1: './assets/Martial Hero/Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imgSrc1: './assets/Martial Hero/Sprites/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imgSrc1: './assets/Martial Hero/Sprites/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imgSrc1: './assets/Martial Hero 2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Take Hit.png',
            framesMax: 3
        },
        death: {
            imgSrc1: './assets/Martial Hero 2/Sprites/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    // default both players velocity is 0 - standing still
    player.velocity.x = 0
    enemy.velocity.x = 0

    // if keys are pressed the player will move along the X axis according to the direction pressed


    // player 1
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else {
        // default animation is idle
        player.switchSprite('idle')
    }

    // when player is jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // player 2
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        // default animation is idle
        enemy.switchSprite('idle')
    }

    // when player is jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // collision detection for player 1
    if (rectangularCollision({ 
        rectangle1:player, 
        rectangle2:enemy 
    }) &&
        player.isAttacking && player.framesCurrent === 4) {
            enemy.takeHit()
            player.isAttacking = false
            // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
            gsap.to('#enemyHealth',{
                width: enemy.health + '%'
            })
    }

    // if player1 misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // collision detection for player 2
    if (rectangularCollision({ 
        rectangle1:enemy, 
        rectangle2:player 
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false
        // document.querySelector('#playerHealth').style.width = player.health + '%'
        gsap.to('#playerHealth',{
            width: player.health + '%'
        })
    }

    // if player2 misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event)=> {
    if (!player.dead) {
        switch (event.key) {
            // player 1
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case 's':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            // player 2
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
    //console.log(event.key)
})

window.addEventListener('keyup', (event)=> {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }
    //console.log(event.key)
})
