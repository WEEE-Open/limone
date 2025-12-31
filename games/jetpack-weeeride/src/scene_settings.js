const SETTINGS_OPT = 4
const SETTINGS_STEP = 5
const SETTINGS_SQUARE = H/4
const SETTINGS_SQUARES_COLORS = ['#555','#333']//['#335','green']
const SETTINGS_SQUARES_SPEED = 0.5

const settings = {
    volume_music:100,
    volume_sounds:100,
    selected:0,
    leaderboard_cleaned:false,
    ticks:{squares:0},
}

const handleKeyPress = ({key}) => {
    if(key in keys) {
        keys[key].pressed = true
        mainKeyPress(key)
    }
}

function settingsSceneInit() {
    settings.selected = 0
    settings.leaderboard_cleaned = false
    settings.ticks = {squares:0}
    addEventListener('keydown',handleKeyPress,true)
}

function settingsSceneKeyPress(key) {
    if(key==' ') {
        if(settings.selected==2 && !settings.leaderboard_cleaned) {
            localStorage.clear()
            settings.leaderboard_cleaned = true
        }
        if(settings.selected==3) {
            adjustVolume()
            removeEventListener('keydown',handleKeyPress,true)
            sceneChange('menu',{type:'circle'})
        }
    }
    if(key=='ArrowDown') {
        settings.selected += 1
        settings.selected %= SETTINGS_OPT
    }
    if(key=='ArrowUp') {
        settings.selected += SETTINGS_OPT-1
        settings.selected %= SETTINGS_OPT
    }
    if(key=='ArrowLeft') {
        if(settings.selected==0 && settings.volume_music>=SETTINGS_STEP)
            settings.volume_music -= SETTINGS_STEP
        if(settings.selected==1 && settings.volume_sounds>=SETTINGS_STEP)
            settings.volume_sounds -= SETTINGS_STEP
    }
    if(key=='ArrowRight') {
        if(settings.selected==0 && settings.volume_music<=100-SETTINGS_STEP)
            settings.volume_music += SETTINGS_STEP
        if(settings.selected==1 && settings.volume_sounds<=100-SETTINGS_STEP)
            settings.volume_sounds += SETTINGS_STEP
    }
}

function settingsSceneKeyRelease(key) {}

function settingsSceneLoop() {
    function render() {
        function renderBG() {
            for(let i=0;i<3+H/SETTINGS_SQUARE;i++) {
                for(let j=0;j<3+W/SETTINGS_SQUARE;j++) {
                    renderRect(
                        j*SETTINGS_SQUARE-settings.ticks.squares,
                        i*SETTINGS_SQUARE-settings.ticks.squares,
                        SETTINGS_SQUARE,
                        SETTINGS_SQUARE,
                        SETTINGS_SQUARES_COLORS[(i+j)%2]
                    )
                    ctx.drawImage(
                        [sprites.amp.img,sprites.screw.img,sprites.player.img][(i+j)%3],
                        0,0,GAME_CELL_SIZE,GAME_CELL_SIZE,
                        j*SETTINGS_SQUARE-settings.ticks.squares+20,
                        i*SETTINGS_SQUARE-settings.ticks.squares+20,
                        SETTINGS_SQUARE-20*2,
                        SETTINGS_SQUARE-20*2,
                    )
                }
            }
            renderRect(0,0,W,H,'#333d')
        }
        function renderSettings() {
            renderText('Settings',W/2,H*3/16,'white',{align:'center',font:'Emulogic',size:1.4})
            renderText('-> ',W/4,H*7/16+settings.selected*H*2/16,'white',{align:'right',font:'Emulogic',size:0.8})
            renderText('Music volume:',W/4,H*7/16,'white',{align:'left',font:'Emulogic',size:0.8})
            renderText(settings.volume_music+'%',W*3/4,H*7/16,'white',{align:'center',font:'Emulogic',size:0.8})
            renderText('FX volume:',W/4,H*9/16,'white',{align:'left',font:'Emulogic',size:0.8})
            renderText(settings.volume_sounds+'%',W*3/4,H*9/16,'white',{align:'center',font:'Emulogic',size:0.8})
            if(settings.selected==0 || settings.selected==1) {
                renderText(
                    keys.ArrowLeft.pressed ? '<       ' : '<      ',
                    W*3/4,H*7/16+settings.selected*H*2/16,keys.ArrowLeft.pressed ? 'yellow' : 'white',
                    {align:'center',font:'Emulogic',size:0.8}
                )
                renderText(
                    keys.ArrowRight.pressed ? '       >' : '      >',
                    W*3/4,H*7/16+settings.selected*H*2/16,keys.ArrowRight.pressed ? 'yellow' : 'white',
                    {align:'center',font:'Emulogic',size:0.8}
                )
            }
            if(!settings.leaderboard_cleaned)
                renderText('Clear leaderboard',W/4,H*11/16,'white',{align:'left',font:'Emulogic',size:0.8})
            else
                renderText('Leaderboard cleaned!',W/4,H*11/16,'grey',{align:'left',font:'Emulogic',size:0.8})
            renderText('Return to Menu',W/4,H*13/16,'white',{align:'left',font:'Emulogic',size:0.8})
        }

        /* Render pipeline */
        /* 0 */ renderBG()
        /* 1 */ renderSettings()
    }
    function update() {
        settings.ticks.squares += SETTINGS_SQUARES_SPEED
        settings.ticks.squares %= SETTINGS_SQUARE*3
    }
    render()
    update()
}