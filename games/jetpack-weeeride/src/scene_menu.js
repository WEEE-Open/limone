const MENU_COLOR_BG1 = '#335'
const MENU_COLOR_BG2 = '#444'
const MENU_COLOR_BG_SQUARES = '#BBB'
const MENU_COLOR_TITLE = 'green'
const MENU_COLOR_SUBTITLE = 'yellow'
const MENU_SQUARE_SIZE = W/8
const MENU_MAXTICK_SQUARES = 50

const menu = {}

function menuSceneInit() {
    menu.ticks = {squares:0}
}

function menuSceneKeyPress(key) {
    if(key==' ') sceneChange('game',{type:'bars',sleep:500})
}

function menuSceneKeyRelease(key) {
    return
}

function menuSceneLoop() {
    function render() {
        renderRect(0,0,W,H,MENU_COLOR_BG1)//createLinearGradient([MENU_COLOR_BG1,MENU_COLOR_BG2]))
        ctx.rotate(-Math.PI/24)
        ctx.translate(-100,40)
        ctx.scale(1.1,1.1)
        for(i=0;i<W/MENU_SQUARE_SIZE;i++)
            renderRect(MENU_SQUARE_SIZE*i,84+16*Math.sin(i+menu.ticks.squares/8),MENU_SQUARE_SIZE+1,MENU_SQUARE_SIZE*2,MENU_COLOR_BG_SQUARES)
        ctx.resetTransform()
        renderText('Jetpack',W*7/12,H*2/6,MENU_COLOR_TITLE,{centered:true,font:'Emulogic',size:1.8})
        renderText('WEEEride',W*8/12,H*3/6,MENU_COLOR_TITLE,{centered:true,font:'Emulogic',size:1.8})
        ctx.drawImage(sprites.jetpack.img,W/9,H/6,256,256)
        renderText('WASD/arrows: move',W/2,H*19/24,MENU_COLOR_SUBTITLE,{centered:true,font:'Emulogic',size:0.8})
        renderText('Space: start game',W/2,H*21/24,MENU_COLOR_SUBTITLE,{centered:true,font:'Emulogic',size:0.8})
        renderText('Version: '+VERSION,10,H-10,'white',{font:'Emulogic',size:0.4})
    }
    function update() {
        menu.ticks.squares++
        menu.ticks.squares %= MENU_MAXTICK_SQUARES
    }
    render()
    update()
}