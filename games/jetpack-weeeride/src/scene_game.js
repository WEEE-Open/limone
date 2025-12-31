const GAME_COLOR_BG = 'lightblue'
const GAME_COLOR_CEILING = '#335'
const GAME_COLOR_FLOOR = '#335'
const GAME_COLOR_LEADERS = ['#fd0','#abc','#a50','grey','grey']
const GAME_CELL_SIZE = 32
const GAME_PADDING = 2
const GAME_CEILING = GAME_CELL_SIZE*GAME_PADDING
const GAME_FLOOR = H-GAME_CELL_SIZE*GAME_PADDING+(GAME_CELL_SIZE-H%GAME_CELL_SIZE+1)%GAME_CELL_SIZE
const GAME_LEFT_LIMIT = GAME_CELL_SIZE*GAME_PADDING
const GAME_RIGHT_LIMIT = W/2
const GAME_SPEED_H = 8
const GAME_SPEED_BG = GAME_SPEED_H*6/8
const GAME_PLAYER_W = GAME_CELL_SIZE
const GAME_PLAYER_H = GAME_CELL_SIZE*2
const GAME_PLAYER_SPEED_V = 0.5
const GAME_PLAYER_SPEED_H = 6
const GAME_LOSESCREEN_SIZE = 0.6
const GAME_MAXTICK_FRAME = 1024
const GAME_MAXTICK_SCREEN = W/GAME_SPEED_H
const GAME_BG_PARALLAX = 3/4

const patterns = {
    screw:[
        [
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0],
        ],
        [
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,0,0,0,0,1,1,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
        ],
        [
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,0,0,0,0,0,0,1,1],
            [1,1,1,1,0,0,0,0,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,0,0,0,0],
        ],
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        [
            [1,0,1,0,1,0,1,0,1,0,1],
            [0,1,0,1,0,1,0,1,0,1,0],
            [1,0,1,0,1,0,1,0,1,0,1],
            [0,1,0,1,0,1,0,1,0,1,0],
            [1,0,1,0,1,0,1,0,1,0,1],
        ],
    ],
    amp:[
        [
            [1],
            [1],
            [1],
            [1],
            [1],
            [1],
        ],
        [
            [1,1,1,1,1,1,1,1,1,1,1],
        ],
        [
            [1,0,1,0,1,0,1,0,1],
            [0,0,0,0,0,0,0,0,0],
            [1,0,1,0,1,0,1,0,1],
            [0,0,0,0,0,0,0,0,0],
            [1,0,1,0,1,0,1,0,1],
        ],
        [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [1,0,0,0,0,0],
            [0,1,0,0,0,0],
            [0,0,1,0,0,0],
            [0,0,0,1,0,0],
            [0,0,0,0,1,0],
            [0,0,0,0,0,1],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
        ],
        [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,1],
            [0,0,0,0,1,0],
            [0,0,0,1,0,0],
            [0,0,1,0,0,0],
            [0,1,0,0,0,0],
            [1,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
        ],
    ],
}

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.w = GAME_PLAYER_W
        this.h = GAME_PLAYER_H
        this.vel_y = 0
        this.acc_y = 0
    }
    render() {
        const frame = Math.floor(game.ticks.frame/sprites.player.slowness)
        ctx.drawImage(sprites.player.img,
            GAME_CELL_SIZE*(frame%sprites.player.frames),
            this.acc_y<0 ? GAME_CELL_SIZE : 0,
            GAME_CELL_SIZE,
            GAME_CELL_SIZE,
            this.x-GAME_CELL_SIZE,
            this.y,
            GAME_CELL_SIZE*2,
            GAME_CELL_SIZE*2
        )
    }
    update() {
        /* Vertical axis */
        if(keys.ArrowUp.pressed || keys.w.pressed || keys[' '].pressed)
            this.acc_y = -GAME_PLAYER_SPEED_V
        else
            this.acc_y = GAME_PLAYER_SPEED_V
        this.vel_y += this.acc_y
        if(this.y+this.vel_y<=GAME_CEILING)
            this.stop(GAME_CEILING)
        if(this.y+this.h+this.vel_y>=GAME_FLOOR)
            this.stop(GAME_FLOOR-this.h)
        this.y += this.vel_y
        /* Horizontal axis */
        if(keys.ArrowLeft.pressed || keys.a.pressed)
            if(this.x>GAME_LEFT_LIMIT)
                this.x -= GAME_PLAYER_SPEED_H
        if(keys.ArrowRight.pressed || keys.d.pressed)
            if(this.x+this.w<GAME_RIGHT_LIMIT)
                this.x += GAME_PLAYER_SPEED_H
    }
    stop(y) {
        this.y = y
        this.vel_y = 0
    }
}

class Entity {
    constructor() {
        this.type = ['screw','amp'][randomInt(2)]
        this.pattern = structuredClone(patterns[this.type][randomInt(patterns[this.type].length)])
        this.x = W
        this.y = randomInt(GAME_PADDING,H/GAME_CELL_SIZE-GAME_PADDING-this.pattern.length)
        this.frame = 0
    }
    render() {
        this.pattern.forEach((row,i) => {
            row.forEach((cell,j) => {
                if(cell)
                    ctx.drawImage(
                        sprites[this.type].img,
                        GAME_CELL_SIZE*(this.frame%sprites[this.type].frames),0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                        this.x+j*GAME_CELL_SIZE,(this.y+i)*GAME_CELL_SIZE,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )
            })
        })
    }
    update() {
        this.x -= game.speed_h
        this.frame = Math.floor(game.ticks.frame/sprites[this.type].slowness)
        this.pattern.forEach((row,i) => {
            row.forEach((cell,j) => {
                if(cell)
                    if(checkIntersection2D(
                        game.player.x,game.player.y,game.player.w,game.player.h,
                        this.x+j*GAME_CELL_SIZE,(this.y+i)*GAME_CELL_SIZE,GAME_CELL_SIZE,GAME_CELL_SIZE
                    )) {
                        if(this.type=='screw') {
                            game.score++
                            this.pattern[i][j] = 0
                            soundPlay('screw')
                        }
                        if(this.type=='amp')
                            if(game.state=='running')
                                gameChangeState('lose')
                    }
            })
        })
    }
}

const game = {
    state:'',
    ticks:{
        frame:0,
        screen:0,
    },
    score:0,
    player:null,
    entities:[],
    speed_h:0,
    pos_bg:0,
    top_scores:[],
}

function gameSceneInit() {
    game.state = 'running'
    game.score = 0
    Object.keys(game.ticks).forEach(t => game.ticks[t] = 0)
    musicStop()
    musicPlay()
    game.player = new Player(GAME_CELL_SIZE*2,GAME_FLOOR-GAME_PLAYER_H)
    game.entities = []
    game.speed_h = GAME_SPEED_H
    // game.speed_bg = GAME_SPEED_BG
    game.pos_bg = 0
    game.show_debug = false
    game.top_scores = []
}

function gameChangeState(state) {
    game.state = state
    if(state=='lose') {
        soundStop('jetpack')
        soundPlay('death')
    }
    if(state=='leaderboard') {
        let name = prompt('Enter your name') || '<UNNAMED>'
        if(name.length>9) name = name.slice(0,9)+'\u{2026}'
        for(k in keys) keys[k].pressed = false
        game.top_scores = JSON.parse(localStorage.getItem('top_scores')) || []
        game.top_scores.push([name,game.score])
        game.top_scores = game.top_scores.sort((a,b) => b[1]-a[1]).slice(0,5)
        localStorage.setItem('top_scores',JSON.stringify(game.top_scores))
    }
}

function gameSceneKeyPress(key) {
    if(game.state=='running') {
        if(key=='l') gameChangeState('lose')
        if(key=='m') musicPlay()
        if(key=='ArrowUp' || key=='w' || key==' ') soundPlay('jetpack')
        if(key=='g') {
            game.show_debug = !game.show_debug
            console.log(localStorage)
        }
    }
    else if(game.state=='lose') {
        if(key==' ') gameChangeState('leaderboard')
    }
    else if(game.state=='leaderboard') {
        if(key==' ') sceneChange('game',{type:'bars',sleep:500})
        if(key=='m') sceneChange('menu',{type:'circle',sleep:500})
    }
}

function gameSceneKeyRelease(key) {
    if(game.state=='running') {
        if(key=='ArrowUp' || key=='w' || key==' ') soundStop('jetpack')
    }
}

function gameSceneLoop() {
    function render() {
        function renderBG() {
            renderRect(0,0,W,H,GAME_COLOR_BG)
            ctx.drawImage(
                sprites.clouds.img,
                W/2-(game.pos_bg%(W*2))/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.clouds.img,
                W*3/2-(game.pos_bg%(W*2))/2,
                0,
                sprites.clouds.dw,
                sprites.clouds.dh
            )
            ctx.drawImage(
                sprites.background.img,
                0-game.pos_bg,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            ctx.drawImage(
                sprites.background.img,
                sprites.background.dw-game.pos_bg,
                0,
                sprites.background.dw,
                sprites.background.dh
            )
            renderRect(0,0,W,H,'rgba(255,255,255,0.2)')
            renderRect(0,0,W,GAME_CEILING,GAME_COLOR_CEILING)
            renderRect(0,GAME_FLOOR,W,H-GAME_FLOOR,GAME_COLOR_FLOOR)
            renderText('v '+VERSION,10,H-10,'green',{font:'Emulogic',size:0.4})
        }
        function renderLoseScreen() {
            renderRect(
                W/2*(1-GAME_LOSESCREEN_SIZE),
                H/2*(1-GAME_LOSESCREEN_SIZE),
                W*GAME_LOSESCREEN_SIZE,
                H*GAME_LOSESCREEN_SIZE,
                'rgba(0,0,0,0.8)'
            )
            renderText('GAME OVER',W/2,H*2/5,'white',{align:'center',font:'emulogic'})
            renderText('Your score is '+game.score,W/2,H*3/5,'white',{align:'center',font:'emulogic',size:0.6})
            renderText('Press space to continue',W/2,H*2/3,'yellow',{align:'center',font:'emulogic',size:0.5})
        }
        function renderLeaderboard() {
            renderRect(
                W/2*(1-GAME_LOSESCREEN_SIZE),
                H/2*(1-GAME_LOSESCREEN_SIZE*1.2),
                W*GAME_LOSESCREEN_SIZE,
                H*GAME_LOSESCREEN_SIZE*1.2,
                'rgba(0,0,0,0.8)'
            )
            renderText('LEADERBOARD',W/2,H*1/4,'white',{align:'center',font:'emulogic'})
            // for(let i=0;i<5;i++)
            //     renderText(
            //         i+1+'.',
            //         W/3,H*2/5-20+i*36,
            //         GAME_COLOR_LEADERS[i],{align:'center',font:'emulogic',size:0.8}
            //     )
            game.top_scores.forEach((entry,i) => {
                renderText(
                    i+1+'.',
                    W/3,H*2/5-20+i*36,
                    GAME_COLOR_LEADERS[i],{align:'center',font:'emulogic',size:0.8}
                )
                renderText(
                    entry[0]+': ',
                    W*3/5,H*2/5-20+i*36,
                    GAME_COLOR_LEADERS[i],{align:'right',font:'emulogic',size:0.6}
                )
                renderText(
                    entry[1],
                    W*3/5,H*2/5-20+i*36,
                    GAME_COLOR_LEADERS[i],{align:'left',font:'emulogic',size:0.6}
                )
            })
            renderText('Press space to retry',W/2,H*4/5-30,'yellow',{align:'center',font:'emulogic',size:0.5})
            renderText('Press M to Menu',W/2,H*4/5,'yellow',{align:'center',font:'emulogic',size:0.5})
        }
        function renderScore() {
            renderText('Score: '+game.score,16,GAME_CEILING*3/4,'green',{font:'emulogic'})
            if(game.show_debug)
                renderText('Speed: '+game.speed_h,W*2/3,GAME_CEILING*3/4,'green',{font:'emulogic',size:0.8})
        }
        function renderGrid() {
            for(let i=0;i<H/GAME_CELL_SIZE;i++) renderRect(0,i*GAME_CELL_SIZE,W,1,'black')
            for(let j=0;j<W/GAME_CELL_SIZE;j++) renderRect(j*GAME_CELL_SIZE,0,1,H,'black')
        }
        /* Render pipeline */
        /* 0 */ renderBG()
        /* 1 */ game.entities.forEach(e => e.render())
        /* 2 */ game.player.render()
        /* 6 */ if(game.show_debug) renderGrid()
        /* 3 */ if(game.state=='lose') renderLoseScreen()
        /* 4 */ if(game.state=='leaderboard') renderLeaderboard()
        /* 5 */ if(game.state=='running') renderScore()
    }
    function update() {
        if(game.state=='running') {
            game.player.update()
            game.entities.forEach(e => e.update())
            if(game.ticks.screen==0) {
                game.entities.push(new Entity())
                if(game.entities.length>2) game.entities.shift()
                game.speed_h += 0.5
            }
            if(game.ticks.screen==0) {
            }
            game.pos_bg += game.speed_h*GAME_BG_PARALLAX
            game.pos_bg %= sprites.background.dw
            game.ticks.frame++
            game.ticks.frame %= GAME_MAXTICK_FRAME
            game.ticks.screen++
            game.ticks.screen %= GAME_MAXTICK_SCREEN
        }
    }
    render()
    update()
}