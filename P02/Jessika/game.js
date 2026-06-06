const gameState = {
    currentScreen: "start",
    player: {
        name: "",
        class: "",
        health: 100,
        maxHealth: 100,
        metaKnowledge: 0,
        level: 1,
        inventory: []
    },
    currentScene: 1,
    gameState: {}
};

// GAME ENGINE 
class GameEngine {
    constructor() {
        this.state = {};
        this.currentSceneId = 1;
        this.textNodes = this.getStory();
    }

    getStory() {
        return [
            // ========== SCENES 1-50: STARTING AREA ==========
            {
                id: 1,
                text: 'You slowly open your eyes. The world is blurry, pixelated... familiar. This is Glitchwood Forest! The first level of your game. But you\'re not at your computer anymore. You\'re inside it.',
                options: [
                    { text: 'Look around carefully', setState: { exploredForest: true }, metaGain: 5, nextText: 2 },
                    { text: 'Check your developer tools', nextText: 3 },
                    { text: 'Try to pinch yourself awake', nextText: 4 }
                ]
            },
            {
                id: 2,
                text: 'You see glitches in the trees - pixels flickering, textures repeating. This is definitely your game. But how did you get here?',
                options: [
                    { text: 'Access the debug console', requiredState: (state) => state.player.class === 'code-mage', setState: { debugAccess: true }, metaGain: 10, nextText: 5 },
                    { text: 'Try to stabilize the glitch', requiredState: (state) => state.player.class === 'reality-bender', setState: { stabilizedGlitch: true }, metaGain: 8, nextText: 6 },
                    { text: 'Study the glitch patterns', requiredState: (state) => state.player.class === 'lore-master', setState: { studiedGlitch: true }, metaGain: 12, nextText: 7 },
                    { text: 'Ignore it and move forward', nextText: 8 }
                ]
            },
            {
                id: 3,
                text: 'You reach for your pocket and find your developer tablet still there! It shows critical errors in the game matrix. The "Reality Integrity" is at 45%.',
                options: [
                    { text: 'Run diagnostic scan', setState: { ranDiagnostic: true }, metaGain: 15, nextText: 9 },
                    { text: 'Try to force an exit command', nextText: 10 }
                ]
            },
            {
                id: 4,
                text: 'You pinch your arm hard. It hurts, but nothing changes. This feels too real to be a dream. The forest seems to pulse with digital energy.',
                options: [
                    { text: 'Accept this new reality', setState: { acceptedReality: true }, metaGain: 5, nextText: 11 },
                    { text: 'Try screaming for help', nextText: 12 }
                ]
            },
            {
                id: 5,
                text: '> DEBUG CONSOLE ACTIVATED\n> Available commands:\n> - reality_scan\n> - code_inject\n> - exit_sequence\n\nThe console accepts your Code Mage credentials. You have admin access!',
                options: [
                    { text: 'Run reality_scan', setState: { realityScanned: true }, metaGain: 20, nextText: 13 },
                    { text: 'Try exit_sequence', nextText: 14 }
                ]
            },
            {
                id: 6,
                text: 'You focus your Reality Bender powers. The glitch stabilizes into a doorway. Beyond it, you see code flowing like rivers of light.',
                options: [
                    { text: 'Step through the doorway', setState: { enteredCodeRealm: true }, metaGain: 25, nextText: 15 },
                    { text: 'Examine the code patterns', nextText: 16 }
                ]
            },
            {
                id: 7,
                text: 'As a Lore Master, you recognize these glitch patterns. They\'re memory leaks from incomplete game assets. The forest is trying to render content that doesn\'t exist.',
                options: [
                    { text: 'Document your findings', setState: { documentedFindings: true }, metaGain: 30, nextText: 17 },
                    { text: 'Try to patch the memory leak', nextText: 18 }
                ]
            },
            {
                id: 8,
                text: 'You walk deeper into the forest. The trees become more pixelated. You hear digital whispers: "The Creator is here..."',
                options: [
                    { text: 'Follow the whispers', nextText: 19 },
                    { text: 'Find higher ground', nextText: 20 }
                ]
            },
            {
                id: 9,
                text: '> DIAGNOSTIC RESULTS:\n> - Reality Matrix: CORRUPTED\n> - Player Identity: VERIFIED\n> - Exit Protocols: LOCKED\n> - Anomalies Detected: 127\n\nA red warning flashes: "Core Game Files Missing"',
                options: [
                    { text: 'Check anomaly details', metaGain: 10, nextText: 21 },
                    { text: 'Attempt emergency reboot', nextText: 58 }
                ]
            },
            {
                id: 10,
                text: 'You type: /exit_game --force\n\nThe console responds: "ERROR: Exit sequence requires Administrator privileges or completion of Primary Questline."',
                options: [
                    { text: 'Search for admin privileges', nextText: 23 },
                    { text: 'Look for the Primary Quest', nextText: 62 }
                ]
            },
            {
                id: 11,
                text: 'You take a deep breath and accept your new reality. The forest seems less hostile now, as if acknowledging you as its creator.',
                options: [
                    { text: 'Look for any town or village', nextText: 25 },
                    { text: 'Sit down and make a plan', nextText: 26 }
                ]
            },
            {
                id: 12,
                text: 'You scream at the top of your lungs. The forest echoes back. The pixels vibrate in response, distorting your voice into digital static.',
                options: [
                    { text: 'Follow the digital echoes', setState: { followedEchoes: true }, metaGain: 3, nextText: 27 },
                    { text: 'Stay put and listen carefully', nextText: 28 },
                    { text: 'Try screaming louder', requiredState: (state) => state.player.health > 80, healthChange: -10, nextText: 29 }
                ]
            },
            {
                id: 13,
                text: '> REALITY_SCAN INITIATED\n> Scanning... 45%\n> Anomaly detected: Player entity mismatch\n> Scanning... 87%\n> CRITICAL: Reality anchor unstable\n> Scan complete.\n\nThe scan shows you\'re anchored to the game world by 127 error threads.',
                options: [
                    { text: 'Examine error threads', nextText: 30 },
                    { text: 'Stabilize reality anchors', nextText: 31 },
                    { text: 'Locate core files', nextText: 32 }
                ]
            },
            {
                id: 14,
                text: 'You input: /exit_sequence --admin\n> ERROR: Access denied. Administrator privileges required.\n> Suggestion: Complete core game loop or find debug key.',
                options: [
                    { text: 'Search for debug key', nextText: 33 },
                    { text: 'Complete core game loop', nextText: 34 },
                    { text: 'Attempt force exit again', nextText: 10 }
                ]
            },
            {
                id: 15,
                text: 'You step through the glitch doorway and find yourself in the Code Realm. Lines of code float around you, glowing with raw potential.',
                options: [
                    { text: 'Follow the JavaScript river', setState: { followedJS: true }, metaGain: 20, nextText: 35 },
                    { text: 'Climb the HTML mountains', nextText: 36 },
                    { text: 'Examine your floating comments', nextText: 37 }
                ]
            },
            {
                id: 16,
                text: 'The code patterns reveal secrets. You see TODO comments you wrote months ago, now rendered as physical objects.',
                options: [
                    { text: 'Try to fix a TODO', requiredState: (state) => state.player.class === 'code-mage', setState: { fixedTodo: true }, metaGain: 25, nextText: 38 },
                    { text: 'Document the patterns', requiredState: (state) => state.player.class === 'lore-master', setState: { documentedPatterns: true }, metaGain: 18, nextText: 39 },
                    { text: 'Absorb the code energy', requiredState: (state) => state.player.class === 'reality-bender', setState: { absorbedCode: true }, metaGain: 15, nextText: 40 }
                ]
            },
            {
                id: 17,
                text: 'You create a log of the memory leaks. Each entry gains you understanding of the broken systems.',
                options: [
                    { text: 'Attempt to fix texture corruption', metaGain: 10, nextText: 41 },
                    { text: 'Study the NPC dialogue trees', nextText: 42 },
                    { text: 'Test the physics engine', requiredState: (state) => state.player.health > 60, healthChange: -20, nextText: 43 }
                ]
            },
            {
                id: 18,
                text: 'You attempt to patch the memory leak. The forest flickers violently. Trees transform into different species.',
                options: [
                    { text: 'Continue the patch', requiredState: (state) => state.player.metaKnowledge >= 30, setState: { continuedPatch: true }, metaGain: 35, nextText: 44 },
                    { text: 'Abort - too dangerous', nextText: 45 },
                    { text: 'Call for help from console', requiredState: (state) => state.debugAccess === true, nextText: 46 }
                ]
            },
            {
                id: 19,
                text: 'The whispers lead you to a clearing where the pixels arrange themselves into a face - your face. It speaks: "Why did you abandon us?"',
                options: [
                    { text: 'Answer: "I didn\'t mean to"', nextText: 117 },
                    { text: 'Ask: "Who are you?"', nextText: 48 },
                    { text: 'Debug the entity', requiredState: (state) => state.player.class === 'code-mage', nextText: 49 }
                ]
            },
            {
                id: 20,
                text: 'You climb a glitched hill. From the top, you see the entire game world. It\'s beautiful but broken.',
                options: [
                    { text: 'Map the visible anomalies', setState: { mappedAnomalies: true }, metaGain: 15, nextText: 50 },
                    { text: 'Look for civilization', nextText: 125 },
                    { text: 'Try to contact the skybox', requiredState: (state) => state.player.metaKnowledge >= 40, nextText: 127 }
                ]
            },
            {
                id: 21,
                text: 'ANOMALY DETAILS:\n#001: Player inventory corrupted\n#045: Time dilation detected\n#089: Quantum NPC entanglement\n#127: Reality anchor unstable',
                options: [
                    { text: 'Investigate time dilation', setState: { investigatedTime: true }, metaGain: 12, nextText: 53 },
                    { text: 'Check quantum entanglement', nextText: 54 },
                    { text: 'Repair inventory corruption', requiredState: (state) => state.player.class === 'code-mage', nextText: 55 }
                ]
            },
            {
                id: 23,
                text: 'Where would admin privileges be in your own game? You designed the systems.',
                options: [
                    { text: 'Head to Debug Temple', setState: { headingToTemple: true }, nextText: 59 },
                    { text: 'Search for Code Vault', nextText: 60 },
                    { text: 'Check your old notes', requiredState: (state) => state.player.class === 'lore-master', nextText: 61 }
                ]
            },
            {
                id: 25,
                text: 'Through the glitched trees, you spot smoke rising. Civilization!',
                options: [
                    { text: 'Enter the settlement', nextText: 65 },
                    { text: 'Observe from a distance', nextText: 66 },
                    { text: 'Call out to the inhabitants', nextText: 67 }
                ]
            },
            {
                id: 26,
                text: 'You sit and make a plan. Resources needed: Food, shelter, information.',
                options: [
                    { text: 'Search for food', nextText: 68 },
                    { text: 'Build temporary shelter', requiredState: (state) => state.player.health > 70, healthChange: -30, nextText: 69 },
                    { text: 'Look for information sources', nextText: 70 }
                ]
            },
            {
                id: 27,
                text: 'The echoes lead to a cave where your screams are stored as .wav files in crystal formations.',
                options: [
                    { text: 'Play back a scream', nextText: 71 },
                    { text: 'Check the error codes', requiredState: (state) => state.player.metaKnowledge >= 15, metaGain: 5, nextText: 72 },
                    { text: 'Collect the audio crystals', setState: { collectedCrystals: true }, metaGain: 5, nextText: 73 }
                ]
            },
            {
                id: 28,
                text: 'In the silence, you hear it: a low hum of electricity. The forest is buzzing with background processes.',
                options: [
                    { text: 'Follow the electrical hum', nextText: 74 },
                    { text: 'Try to identify the processes', requiredState: (state) => state.player.class === 'code-mage', nextText: 75 },
                    { text: 'Meditate to hear better', requiredState: (state) => state.player.class === 'lore-master', nextText: 76 }
                ]
            },
            {
                id: 29,
                text: 'Your louder scream causes a feedback loop. The forest glitches violently.',
                options: [
                    { text: 'Look at the revealed code', setState: { sawCodeLayer: true }, metaGain: 25, nextText: 77 },
                    { text: 'Try to stabilize with a softer sound', nextText: 78 },
                    { text: 'Scream even louder (risky)', requiredState: (state) => state.player.health > 90, healthChange: -40, nextText: 321 }
                ]
            },
            {
                id: 30,
                text: 'ERROR THREAD DETAILS:\nThread #001: Player.spawn() called from unknown source\nEach thread connects to your physical body.',
                options: [
                    { text: 'Trace Thread #001', setState: { tracedThread1: true }, metaGain: 18, nextText: 80 },
                    { text: 'Fix time desync', requiredState: (state) => state.player.metaKnowledge >= 35, nextText: 130 },
                    { text: 'Allocate more memory', nextText: 82 }
                ]
            },
            {
                id: 31,
                text: 'You attempt to stabilize reality anchors. The error threads glow brighter, but pulling on them sends pain through your connection.',
                options: [
                    { text: 'Continue stabilizing', healthChange: -15, nextText: 189 },
                    { text: 'Stop - too painful', nextText: 84 }
                ]
            },
            {
                id: 32,
                text: 'Core files are scattered. The main ones are in the Debug Temple and Code Vault.',
                options: [
                    { text: 'Go to Debug Temple', nextText: 59 },
                    { text: 'Search for Code Vault', nextText: 60 }
                ]
            },
            {
                id: 33,
                text: 'Debug keys were hidden in clever places throughout your game.',
                options: [
                    { text: 'Find an enemy to defeat', nextText: 85 },
                    { text: 'Look for the waterfall', nextText: 86 },
                    { text: 'Check for your signature', nextText: 87 }
                ]
            },
            {
                id: 34,
                text: 'To complete the core game loop, you need to finish what you started.',
                options: [
                    { text: 'Accept your role as creator', nextText: 88 },
                    { text: 'Try to bypass the requirement', nextText: 201 }
                ]
            },
            {
                id: 35,
                text: 'The JavaScript river carries functions and variables like leaves.',
                options: [
                    { text: 'Catch a familiar function', nextText: 90 },
                    { text: 'Follow the river downstream', nextText: 91 },
                    { text: 'Try to modify the code flow', requiredState: (state) => state.player.class === 'code-mage', nextText: 92 }
                ]
            },
            {
                id: 36,
                text: 'The HTML mountains are structured with <div> peaks and <section> plateaus.',
                options: [
                    { text: 'Climb a <div> mountain', requiredState: (state) => state.player.health > 60, healthChange: -25, nextText: 93 },
                    { text: 'Study the structure', nextText: 209 }
                ]
            },
            {
                id: 37,
                text: 'Your floating comments reveal your thoughts during development.',
                options: [
                    { text: 'Read a humorous comment', nextText: 95 },
                    { text: 'Read a frustrated comment', nextText: 96 }
                ]
            },
            {
                id: 38,
                text: 'You fix a TODO item. The game world stabilizes slightly.',
                options: [
                    { text: 'Continue fixing', nextText: 97 },
                    { text: 'Explore more', nextText: 98 }
                ]
            },
            {
                id: 39,
                text: 'You document code patterns thoroughly, gaining clarity.',
                options: [
                    { text: 'Use notes to navigate', nextText: 99 },
                    { text: 'Share with NPCs', nextText: 223 }
                ]
            },
            {
                id: 40,
                text: 'You absorb code energy. Your powers grow stronger.',
                options: [
                    { text: 'Reshape a small area', requiredState: (state) => state.player.class === 'reality-bender', nextText: 101 },
                    { text: 'Follow the energy source', nextText: 102 }
                ]
            },
            {
                id: 41,
                text: 'You focus on a corrupted texture - a tree that flickers between oak and palm.',
                options: [
                    { text: 'Fix it systematically', requiredState: (state) => state.player.metaKnowledge >= 40, nextText: 103 },
                    { text: 'This is too much', nextText: 104 },
                    { text: 'Find root cause', nextText: 105 }
                ]
            },
            {
                id: 42,
                text: 'The NPC dialogue trees are incomplete. You find branching paths that lead nowhere.',
                options: [
                    { text: 'Write dialogue', requiredState: (state) => state.player.class === 'lore-master', nextText: 106 },
                    { text: 'Follow broken quest', nextText: 237 }
                ]
            },
            {
                id: 43,
                text: 'You test the physics by jumping. You float down too slowly. Gravity feels wrong.',
                options: [
                    { text: 'Adjust gravity', requiredState: (state) => state.debugAccess === true, nextText: 108 },
                    { text: 'Test collision', nextText: 109 },
                    { text: 'Stop testing', nextText: 110 }
                ]
            },
            {
                id: 44,
                text: 'You successfully patch the memory leak! The forest stabilizes into a cohesive scene.',
                options: [
                    { text: 'Patch overflow too', requiredState: (state) => state.player.metaKnowledge >= 50, nextText: 111 },
                    { text: 'Revert patch', nextText: 112 }
                ]
            },
            {
                id: 45,
                text: 'You abort the patch. The forest returns to its glitched state.',
                options: [
                    { text: 'Find strategic approach', nextText: 113 },
                    { text: 'Accept glitches', setState: { acceptedGlitches: true }, nextText: 114 }
                ]
            },
            {
                id: 46,
                text: 'You call the debug console. "Memory leak patch requires root access."',
                options: [
                    { text: 'Search for root access', nextText: 253 },
                    { text: 'Find another way', nextText: 116 }
                ]
            },
            {
                id: 48,
                text: '"Who are you?" you ask. The face flickers.',
                options: [
                    { text: 'Give them names', requiredState: (state) => state.player.class === 'lore-master', nextText: 119 },
                    { text: 'Ask how to fix', nextText: 120 }
                ]
            },
            {
                id: 49,
                text: 'You run debug commands on the entity. It\'s classified as "Unfinished_Concept_001".',
                options: [
                    { text: 'Complete entity', requiredState: (state) => state.player.metaKnowledge >= 35, nextText: 121 },
                    { text: 'Delete entity', nextText: 122 }
                ]
            },
            {
                id: 50,
                text: 'Your map reveals patterns. The anomalies form a spiral.',
                options: [
                    { text: 'Follow spiral', setState: { followingSpiral: true }, nextText: 123 },
                    { text: 'Mark points of interest', nextText: 124 }
                ]
            },

            // ========== SCENES 51-100: MID-GAME EXPLORATION ==========
            {
                id: 53,
                text: 'Time dilation means you\'re experiencing time 1.3x faster than real world.',
                options: [
                    { text: 'Use advantage', nextText: 129 },
                    { text: 'Sync times', nextText: 130 }
                ]
            },
            {
                id: 54,
                text: 'Quantum NPC entanglement means characters exist in multiple states.',
                options: [
                    { text: 'Observe NPC', nextText: 131 },
                    { text: 'Study entanglement', requiredState: (state) => state.player.metaKnowledge >= 25, nextText: 132 }
                ]
            },
            {
                id: 55,
                text: 'You repair inventory corruption. Items reappear.',
                options: [
                    { text: 'Equip glitched sword', setState: { equippedSword: true }, nextText: 133 },
                    { text: 'Test healing potion', nextText: 134 }
                ]
            },
            {
                id: 56,
                text: 'You look at your hands. They\'re blocky, like a low-poly model.',
                options: [
                    { text: 'Test abilities', nextText: 135 },
                    { text: 'Restore form', nextText: 136 }
                ]
            },
            {
                id: 57,
                text: 'The cube forest is mathematically perfect but soulless.',
                options: [
                    { text: 'Appreciate order', nextText: 137 },
                    { text: 'Miss glitches', nextText: 138 }
                ]
            },
            {
                id: 58,
                text: 'EMERGENCY REBOOT INITIATED\nThe world dissolves into loading screens... then reassembles differently.',
                options: [
                    { text: 'Check your new form', nextText: 56 },
                    { text: 'Explore the changed world', nextText: 57 },
                    { text: 'Try another reboot', healthChange: -50, nextText: 139 }
                ]
            },
            {
                id: 59,
                text: 'The Debug Temple lies ahead. It\'s a cathedral made of console windows.',
                options: [
                    { text: 'Enter the Debug Temple', nextText: 141 },
                    { text: 'Scan for security', requiredState: (state) => state.debugAccess === true, nextText: 307 }
                ]
            },
            {
                id: 60,
                text: 'The Code Vault is hidden behind encryption mountains.',
                options: [
                    { text: 'Search for key fragments', nextText: 143 },
                    { text: 'Try to brute force entry', requiredState: (state) => state.player.class === 'code-mage', nextText: 144 }
                ]
            },
            {
                id: 61,
                text: 'Your old notes mention: "Admin pass = unfinished symphony."',
                options: [
                    { text: 'Try song titles', nextText: 145 },
                    { text: 'Look for musical clues', nextText: 146 }
                ]
            },
            {
                id: 62,
                text: 'QUEST ACCEPTED: "Restore Reality"',
                options: [
                    { text: 'Find the Heart of the Code', nextText: 147 },
                    { text: 'Ask about the redacted objective', nextText: 148 }
                ]
            },
            {
                id: 65,
                text: 'As you enter, the settlement stabilizes into a medieval village.',
                options: [
                    { text: 'Talk to the villagers', nextText: 153 },
                    { text: 'Explore the village', nextText: 154 }
                ]
            },
            {
                id: 66,
                text: 'From a distance, you watch the settlement phase between realities.',
                options: [
                    { text: 'Time your approach', nextText: 155 },
                    { text: 'Continue observing', nextText: 156 }
                ]
            },
            {
                id: 67,
                text: 'You call out. Figures appear at the edge of town.',
                options: [
                    { text: 'Approach them', nextText: 157 },
                    { text: 'Ask who they are', nextText: 158 }
                ]
            },
            {
                id: 68,
                text: 'You find glowing berries on glitched bushes.',
                options: [
                    { text: 'Eat the safe-looking berries', healthChange: 20, nextText: 159 },
                    { text: 'Look for other food', nextText: 160 }
                ]
            },
            {
                id: 69,
                text: 'You build a shelter from fallen logs and glitched leaves.',
                options: [
                    { text: 'Rest in the shelter', healthChange: 40, nextText: 161 },
                    { text: 'Improve the shelter', nextText: 162 }
                ]
            },
            {
                id: 70,
                text: 'You find a glitched book floating in a clearing.',
                options: [
                    { text: 'Read the book', nextText: 163 },
                    { text: 'Take the book with you', nextText: 164 }
                ]
            },
            {
                id: 71,
                text: 'You play back a scream crystal. Your own voice echoes.',
                options: [
                    { text: 'Play another', nextText: 165 },
                    { text: 'Stop playing them', nextText: 166 }
                ]
            },
            {
                id: 72,
                text: 'Error codes: programmer humor. Someone was making jokes.',
                options: [
                    { text: 'Decode the humor', nextText: 167 },
                    { text: 'Look for serious errors', nextText: 168 }
                ]
            },
            {
                id: 73,
                text: 'You collect scream crystals. They vibrate in your pocket.',
                options: [
                    { text: 'Test a crystal as a tool', nextText: 169 },
                    { text: 'Store them carefully', nextText: 170 }
                ]
            },
            {
                id: 74,
                text: 'The electrical hum leads to a power source: a giant crystal.',
                options: [
                    { text: 'Touch the crystal', nextText: 171 },
                    { text: 'Study the connections', nextText: 172 }
                ]
            },
            {
                id: 75,
                text: 'You identify processes: Reality_Render.exe, Physics_Engine.dll.',
                options: [
                    { text: 'Try to optimize Reality_Render', nextText: 173 },
                    { text: 'Check Player_Controller code', nextText: 174 }
                ]
            },
            {
                id: 76,
                text: 'Meditating, you hear individual processes.',
                options: [
                    { text: 'Sync with the game loop', nextText: 175 },
                    { text: 'Listen deeper', nextText: 176 }
                ]
            },
            {
                id: 77,
                text: 'Beneath the ground, you see the source code of the world.',
                options: [
                    { text: 'Read your modified code', nextText: 177 },
                    { text: 'Try to edit it', nextText: 178 }
                ]
            },
            {
                id: 78,
                text: 'You hum softly. The glitches calm. Sound stabilizes reality.',
                options: [
                    { text: 'Experiment with different sounds', nextText: 179 },
                    { text: 'Create a stabilization song', nextText: 180 }
                ]
            },
            {
                id: 80,
                text: 'Thread #001 traces back to your computer chair.',
                options: [
                    { text: 'Follow the thread', nextText: 183 },
                    { text: 'Tug on the thread', healthChange: -30, nextText: 184 }
                ]
            },
            {
                id: 82,
                text: 'You allocate more memory. World becomes detailed but unstable.',
                options: [
                    { text: 'Allocate even more', nextText: 187 },
                    { text: 'Return to default', nextText: 188 }
                ]
            },
            {
                id: 84,
                text: 'You stop stabilizing. Pain subsides.',
                options: [
                    { text: 'Try different approach', nextText: 191 },
                    { text: 'Accept instability', nextText: 192 }
                ]
            },
            {
                id: 85,
                text: 'You find a glitched wolf. "Debug entity detected."',
                options: [
                    { text: 'Fight the wolf', healthChange: -25, nextText: 193 },
                    { text: 'Talk to the wolf', nextText: 194 }
                ]
            },
            {
                id: 86,
                text: 'The waterfall exists in three places simultaneously.',
                options: [
                    { text: 'Enter the cave', nextText: 195 },
                    { text: 'Examine the waterfall', nextText: 196 }
                ]
            },
            {
                id: 87,
                text: 'You find your signature carved into a glitched tree.',
                options: [
                    { text: 'Take what\'s inside', nextText: 197 },
                    { text: 'Leave it', nextText: 198 }
                ]
            },
            {
                id: 88,
                text: 'You accept your role as creator. The world responds.',
                options: [
                    { text: 'Begin creation', nextText: 199 },
                    { text: 'Seek guidance', nextText: 200 }
                ]
            },
            {
                id: 90,
                text: 'You catch a function. Holding it, you feel its purpose.',
                options: [
                    { text: 'Modify the function', nextText: 203 },
                    { text: 'Release it', nextText: 204 }
                ]
            },
            {
                id: 91,
                text: 'Downstream, the river converges into a lake of compiled code.',
                options: [
                    { text: 'Swim in the lake', nextText: 205 },
                    { text: 'Study the shoreline', nextText: 206 }
                ]
            },
            {
                id: 92,
                text: 'You modify the code flow. River changes direction.',
                options: [
                    { text: 'Make more changes', nextText: 207 },
                    { text: 'Restore original flow', nextText: 208 }
                ]
            },
            {
                id: 93,
                text: 'Climbing the mountain, you see the Code Realm structure.',
                options: [
                    { text: 'Study the structure', nextText: 209 },
                    { text: 'Jump to another element', nextText: 210 }
                ]
            },
            {
                id: 95,
                text: 'Humorous comment about procrastination.',
                options: [
                    { text: 'Read another', nextText: 213 },
                    { text: 'Actually add squirrels', nextText: 214 }
                ]
            },
            {
                id: 96,
                text: 'Frustrated comment about collision detection.',
                options: [
                    { text: 'Feel sympathy', nextText: 215 },
                    { text: 'Try to fix collision now', nextText: 216 }
                ]
            },
            {
                id: 97,
                text: 'You fix more TODOs. Growing tired.',
                options: [
                    { text: 'Keep fixing', healthChange: -15, metaGain: 20, nextText: 217 },
                    { text: 'Take a break', nextText: 218 }
                ]
            },
            {
                id: 98,
                text: 'You explore deeper into Code Realm.',
                options: [
                    { text: 'Explore cut features', nextText: 219 },
                    { text: 'Return to physical world', nextText: 220 }
                ]
            },
            {
                id: 99,
                text: 'Using notes, you navigate to stable area.',
                options: [
                    { text: 'Rest here', healthChange: 30, nextText: 221 },
                    { text: 'Study why area is stable', nextText: 222 }
                ]
            },
            {
                id: 101,
                text: 'You reshape a small clearing. Beautiful but unnatural.',
                options: [
                    { text: 'Reshape more', nextText: 225 },
                    { text: 'Restore natural glitches', nextText: 226 }
                ]
            },
            {
                id: 102,
                text: 'The energy leads to a nexus point. All code converges.',
                options: [
                    { text: 'Touch the nexus', nextText: 227 },
                    { text: 'Analyze the nexus', nextText: 228 }
                ]
            },
            {
                id: 103,
                text: 'You systematically fix textures. Forest loses character.',
                options: [
                    { text: 'Keep fixing', nextText: 229 },
                    { text: 'Leave some glitches', nextText: 230 }
                ]
            },
            {
                id: 104,
                text: 'You give up. Scale is overwhelming.',
                options: [
                    { text: 'Feel despair', healthChange: -10, nextText: 231 },
                    { text: 'Find different purpose', nextText: 232 }
                ]
            },
            {
                id: 105,
                text: 'Root cause: memory allocation errors.',
                options: [
                    { text: 'Fix memory allocation', nextText: 233 },
                    { text: 'Create missing assets', nextText: 234 }
                ]
            },
            {
                id: 106,
                text: 'You write dialogue for merchant. NPC solidifies.',
                options: [
                    { text: 'Talk to creation', nextText: 235 },
                    { text: 'Write more dialogue', nextText: 236 }
                ]
            },
            {
                id: 108,
                text: 'You adjust gravity. Islands crash.',
                options: [
                    { text: 'Fix islands too', nextText: 239 },
                    { text: 'Revert gravity change', nextText: 240 }
                ]
            },
            {
                id: 109,
                text: 'Testing collision reveals invisible boundaries.',
                options: [
                    { text: 'Map boundaries', nextText: 241 },
                    { text: 'Try to fix collision', nextText: 242 }
                ]
            },
            {
                id: 110,
                text: 'You stop testing. Physics is broken.',
                options: [
                    { text: 'Find workarounds', nextText: 243 },
                    { text: 'Accept broken physics', nextText: 244 }
                ]
            },
            {
                id: 111,
                text: 'You patch buffer overflow. System stabilizes.',
                options: [
                    { text: 'Continue patching', nextText: 245 },
                    { text: 'Stop while ahead', nextText: 246 }
                ]
            },
            {
                id: 112,
                text: 'You revert patch. Memory leak returns.',
                options: [
                    { text: 'Try different approach', nextText: 247 },
                    { text: 'Leave it be', nextText: 248 }
                ]
            },
            {
                id: 113,
                text: 'Strategic approach: fix foundational systems.',
                options: [
                    { text: 'Work on memory management', nextText: 249 },
                    { text: 'Stabilize physics', nextText: 250 }
                ]
            },
            {
                id: 114,
                text: 'You accept glitches. They\'re part of charm.',
                options: [
                    { text: 'Learn to love glitches', nextText: 251 },
                    { text: 'Document as features', nextText: 252 }
                ]
            },
            {
                id: 116,
                text: 'Maybe contain leak instead of patching.',
                options: [
                    { text: 'Build memory container', nextText: 255 },
                    { text: 'Find another solution', nextText: 256 }
                ]
            },
            {
                id: 117,
                text: '"I didn\'t mean to," you say. The pixelated face looks sad.',
                options: [
                    { text: '"I\'ll finish it now"', setState: { promisedToFinish: true }, metaGain: 25, nextText: 340 },
                    { text: '"I need to go home"', nextText: 118 }
                ]
            },
            {
                id: 118,
                text: '"I need to go home," you insist. Face looks hurt.',
                options: [
                    { text: 'Insist leaving', nextText: 259 },
                    { text: 'Reconsider', nextText: 260 }
                ]
            },
            {
                id: 119,
                text: 'You give names to abandoned ideas. They solidify.',
                options: [
                    { text: 'Name more ideas', nextText: 261 },
                    { text: 'Give them purpose', nextText: 262 }
                ]
            },
            {
                id: 120,
                text: '"How do I fix you?" "Complete us or delete cleanly."',
                options: [
                    { text: 'Complete them', nextText: 263 },
                    { text: 'Delete them', nextText: 264 }
                ]
            },
            {
                id: 121,
                text: 'You complete entity. It becomes full NPC.',
                options: [
                    { text: 'Talk to creation', nextText: 265 },
                    { text: 'Create more NPCs', nextText: 266 }
                ]
            },
            {
                id: 122,
                text: 'You delete entity. It dissolves. You feel guilt.',
                options: [
                    { text: 'Delete others', nextText: 267 },
                    { text: 'Stop deleting', nextText: 268 }
                ]
            },
            {
                id: 123,
                text: 'Following spiral. Reality warps. Core Glitch close.',
                options: [
                    { text: 'Continue', nextText: 269 },
                    { text: 'Turn back', nextText: 270 }
                ]
            },
            {
                id: 124,
                text: 'You mark anomalies: floating island, uphill river.',
                options: [
                    { text: 'Explore floating island', nextText: 271 },
                    { text: 'Investigate breathing cave', nextText: 272 }
                ]
            },
            {
                id: 125,
                text: 'Flickering town stabilizes. NPCs unaware.',
                options: [
                    { text: 'Talk to townsfolk', nextText: 273 },
                    { text: 'Find town elder', nextText: 274 }
                ]
            },
            {
                id: 126,
                text: 'Cube city is geometric. Efficient but sterile.',
                options: [
                    { text: 'Meet citizen', nextText: 275 },
                    { text: 'Find city controller', nextText: 276 }
                ]
            },
            {
                id: 127,
                text: '"How can I help?" Clouds: "FINISH OR LET GO."',
                options: [
                    { text: 'Promise finish', setState: { promisedToFinish: true }, nextText: 277 },
                    { text: 'Ask how let go', nextText: 278 }
                ]
            },
            {
                id: 128,
                text: 'You modify skybox. Sky changes colors.',
                options: [
                    { text: 'Make permanent changes', nextText: 279 },
                    { text: 'Restore original sky', nextText: 280 }
                ]
            },
            {
                id: 129,
                text: 'You use time advantage. Disorienting but useful.',
                options: [
                    { text: 'Continue using advantage', nextText: 281 },
                    { text: 'Try to sync times', nextText: 130 }
                ]
            },
            {
                id: 130,
                text: 'Syncing times makes world feel real.',
                options: [
                    { text: 'Keep times synced', nextText: 283 },
                    { text: 'Return to dilation', nextText: 284 }
                ]
            },
            {
                id: 131,
                text: 'You observe NPC. It collapses into merchant.',
                options: [
                    { text: 'Talk to merchant', nextText: 285 },
                    { text: 'Observe another NPC', nextText: 286 }
                ]
            },
            {
                id: 132,
                text: 'Studying entanglement, you learn to choose states.',
                options: [
                    { text: 'Experiment with power', nextText: 287 },
                    { text: 'Use carefully', nextText: 288 }
                ]
            },
            {
                id: 133,
                text: 'Glitched sword phases between solid and intangible.',
                options: [
                    { text: 'Keep using it', setState: { usingGlitchedSword: true }, nextText: 289 },
                    { text: 'Find reliable weapon', nextText: 290 }
                ]
            },
            {
                id: 134,
                text: 'Healing potion works but causes glitches.',
                options: [
                    { text: 'Drink more', healthChange: 30, setState: { potionGlitches: true }, nextText: 291 },
                    { text: 'Use sparingly', healthChange: 15, nextText: 292 }
                ]
            },
            {
                id: 135,
                text: 'Low-poly form has advantages but feels less human.',
                options: [
                    { text: 'Embrace efficiency', nextText: 293 },
                    { text: 'Miss humanity', nextText: 294 }
                ]
            },
            {
                id: 136,
                text: 'You try to restore form. Exhausting.',
                options: [
                    { text: 'Continue restoring', healthChange: -20, nextText: 295 },
                    { text: 'Accept low-poly form', nextText: 296 }
                ]
            },
            {
                id: 137,
                text: 'Cube forest order is peaceful.',
                options: [
                    { text: 'Stay appreciate', nextText: 297 },
                    { text: 'Return glitched forest', nextText: 298 }
                ]
            },
            {
                id: 138,
                text: 'You miss chaos of glitched forest.',
                options: [
                    { text: 'Try restore glitches', nextText: 299 },
                    { text: 'Learn appreciate both', nextText: 300 }
                ]
            },
            {
                id: 139,
                text: 'You risk reboot. World becomes wireframe.',
                options: [
                    { text: 'Explore wireframe world', nextText: 301 },
                    { text: 'Try another reboot', healthChange: -70, nextText: 302 }
                ]
            },
            {
                id: 141,
                text: 'Inside Debug Temple. Consoles show game status.',
                options: [
                    { text: 'Check your status', nextText: 305 },
                    { text: 'Explore other consoles', nextText: 306 }
                ]
            },
            {
                id: 143,
                text: 'Key fragments hidden: first bug, favorite code.',
                options: [
                    { text: 'Search first bug', nextText: 309 },
                    { text: 'Find favorite code', nextText: 310 }
                ]
            },
            {
                id: 144,
                text: 'Brute forcing triggers security. Guardians attack.',
                options: [
                    { text: 'Fight guardians', healthChange: -40, nextText: 311 },
                    { text: 'Try reason with them', nextText: 312 }
                ]
            },
            {
                id: 145,
                text: 'You try song titles. All denied.',
                options: [
                    { text: 'Try musical terms', nextText: 313 },
                    { text: 'Look clues in music', nextText: 314 }
                ]
            },
            {
                id: 146,
                text: 'You find sheet music. Melody is clue.',
                options: [
                    { text: 'Hum melody', nextText: 315 },
                    { text: 'Transcribe notes', nextText: 316 }
                ]
            },
            {
                id: 147,
                text: 'Heart of Code beats at temple center.',
                options: [
                    { text: 'Touch Heart', nextText: 317 },
                    { text: 'Analyze first', requiredState: (state) => state.player.metaKnowledge >= 50, nextText: 318 }
                ]
            },
            {
                id: 148,
                text: 'System: "REDACTED cannot be displayed."',
                options: [
                    { text: 'Demand know', nextText: 319 },
                    { text: 'Accept mystery', nextText: 320 }
                ]
            },
            {
                id: 149,
                text: 'You stand before Core Glitch. Hole in reality.',
                options: [
                    { text: 'Jump into glitch', requiredState: (state) => state.player.health > 80, healthChange: -60, nextText: 321 },
                    { text: 'Try repair it', nextText: 322 },
                    { text: 'Listen whispers', nextText: 323 }
                ]
            },
            {
                id: 150,
                text: 'You prepare: gather resources, study patterns.',
                options: [
                    { text: 'Gather more resources', nextText: 324 },
                    { text: 'Study more', nextText: 325 }
                ]
            },

            // ========== SCENES 151-200: FINAL PATHS ==========
            {
                id: 153,
                text: 'Villagers gather. "Creator, we need stories."',
                options: [
                    { text: 'Give stories', nextText: 330 },
                    { text: 'Ask about village', nextText: 331 }
                ]
            },
            {
                id: 154,
                text: 'You explore village. Buildings flicker.',
                options: [
                    { text: 'Visit tavern', nextText: 332 },
                    { text: 'Check market', nextText: 333 }
                ]
            },
            {
                id: 155,
                text: 'You time approach when town stable.',
                options: [
                    { text: 'Explore now', nextText: 334 },
                    { text: 'Wait next cycle', nextText: 335 }
                ]
            },
            {
                id: 156,
                text: 'You continue observing. Pattern emerges.',
                options: [
                    { text: 'Time entry', nextText: 336 },
                    { text: 'Keep observing', nextText: 337 }
                ]
            },
            {
                id: 157,
                text: 'You approach figures. They\'re low-resolution.',
                options: [
                    { text: 'Ask what need', nextText: 338 },
                    { text: 'Try improve resolution', nextText: 339 }
                ]
            },
            {
                id: 158,
                text: '"Who are you?" "We are Unfinished."',
                options: [
                    { text: 'Promise complete', nextText: 340 },
                    { text: 'Ask how complete', nextText: 341 }
                ]
            },
            {
                id: 159,
                text: 'You eat safe berries. Taste like electricity.',
                options: [
                    { text: 'Eat more', healthChange: 10, nextText: 342 },
                    { text: 'Save later', setState: { savedBerries: true }, nextText: 343 }
                ]
            },
            {
                id: 160,
                text: 'Looking for other food: mushrooms, fish.',
                options: [
                    { text: 'Try mushrooms', requiredState: (state) => state.player.health > 50, healthChange: -30, nextText: 344 },
                    { text: 'Catch fish', healthChange: 25, nextText: 345 }
                ]
            },
            {
                id: 161,
                text: 'Resting in shelter. Energy returns.',
                options: [
                    { text: 'Rest longer', healthChange: 50, nextText: 346 },
                    { text: 'Continue exploring', nextText: 347 }
                ]
            },
            {
                id: 162,
                text: 'You improve shelter. Could be permanent.',
                options: [
                    { text: 'Fortify further', healthChange: -20, nextText: 348 },
                    { text: 'Use as is', nextText: 349 }
                ]
            },
            {
                id: 163,
                text: 'Reading book. Fragments of forgotten lore.',
                options: [
                    { text: 'Read more', metaGain: 15, nextText: 350 },
                    { text: 'Take notes', setState: { tookNotes: true }, nextText: 351 }
                ]
            },
            {
                id: 164,
                text: 'You take book. It floats beside you.',
                options: [
                    { text: 'Let guide', nextText: 352 },
                    { text: 'Study first', nextText: 353 }
                ]
            },
            {
                id: 165,
                text: 'You play another scream. Distortion intensifies.',
                options: [
                    { text: 'Play more', healthChange: -10, nextText: 354 },
                    { text: 'Really stop', nextText: 355 }
                ]
            },
            {
                id: 166,
                text: 'You stop playing. Cave returns quiet.',
                options: [
                    { text: 'Leave cave', nextText: 356 },
                    { text: 'Study crystals', nextText: 357 }
                ]
            },
            {
                id: 167,
                text: 'Decoding humor reveals your own jokes.',
                options: [
                    { text: 'Appreciate humor', metaGain: 5, nextText: 358 },
                    { text: 'Fix serious errors', nextText: 359 }
                ]
            },
            {
                id: 168,
                text: 'Looking for serious errors. Found many.',
                options: [
                    { text: 'Prioritize fixes', nextText: 360 },
                    { text: 'Overwhelmed', healthChange: -15, nextText: 361 }
                ]
            },
            {
                id: 169,
                text: 'Testing crystal as tool. Emits sonic pulse.',
                options: [
                    { text: 'Test more', setState: { testedCrystals: true }, nextText: 362 },
                    { text: 'Use carefully', nextText: 363 }
                ]
            },
            {
                id: 170,
                text: 'Storing crystals carefully. They still hum.',
                options: [
                    { text: 'Check hum', nextText: 364 },
                    { text: 'Ignore hum', nextText: 365 }
                ]
            },
            {
                id: 171,
                text: 'You touch crystal. Energy surges.',
                options: [
                    { text: 'Absorb energy', metaGain: 20, healthChange: -25, nextText: 366 },
                    { text: 'Pull away', nextText: 367 }
                ]
            },
            {
                id: 172,
                text: 'Studying connections. They form network.',
                options: [
                    { text: 'Trace network', nextText: 368 },
                    { text: 'Modify connections', nextText: 369 }
                ]
            },
            {
                id: 173,
                text: 'You optimize render. Graphics improve.',
                options: [
                    { text: 'Optimize more', nextText: 370 },
                    { text: 'Check side effects', nextText: 371 }
                ]
            },
            {
                id: 174,
                text: 'Checking player code. It\'s your consciousness.',
                options: [
                    { text: 'Read code', metaGain: 25, nextText: 372 },
                    { text: 'Modify carefully', healthChange: -50, nextText: 373 }
                ]
            },
            {
                id: 175,
                text: 'Syncing with game loop. Heartbeat matches.',
                options: [
                    { text: 'Deepen sync', setState: { syncedDeeply: true }, nextText: 374 },
                    { text: 'Break sync', nextText: 375 }
                ]
            },
            {
                id: 176,
                text: 'Listening deeper. You hear everything.',
                options: [
                    { text: 'Listen more', healthChange: -10, nextText: 376 },
                    { text: 'Block noise', nextText: 377 }
                ]
            },
            {
                id: 177,
                text: 'Reading modified code. Someone changed it.',
                options: [
                    { text: 'Find who', nextText: 378 },
                    { text: 'Restore original', nextText: 379 }
                ]
            },
            {
                id: 178,
                text: 'You edit code. World changes instantly.',
                options: [
                    { text: 'Edit more', setState: { editedCode: true }, nextText: 380 },
                    { text: 'Undo edit', nextText: 381 }
                ]
            },
            {
                id: 179,
                text: 'Experimenting sounds. Each affects glitches.',
                options: [
                    { text: 'Find perfect sound', nextText: 382 },
                    { text: 'Stop experiments', nextText: 383 }
                ]
            },
            {
                id: 180,
                text: 'Creating stabilization song. It works.',
                options: [
                    { text: 'Refine song', setState: { refinedSong: true }, nextText: 384 },
                    { text: 'Teach song', nextText: 385 }
                ]
            },
            {
                id: 183,
                text: 'Following thread. It leads to your body.',
                options: [
                    { text: 'Follow further', metaGain: 30, nextText: 390 },
                    { text: 'Stop following', nextText: 391 }
                ]
            },
            {
                id: 184,
                text: 'Tugging thread. Pain shoots through.',
                options: [
                    { text: 'Tug harder', healthChange: -40, nextText: 392 },
                    { text: 'Stop tugging', nextText: 393 }
                ]
            },
            {
                id: 187,
                text: 'Allocating more memory. Details increase.',
                options: [
                    { text: 'Maximum allocation', setState: { maxAllocation: true }, nextText: 398 },
                    { text: 'Stop now', nextText: 399 }
                ]
            },
            {
                id: 188,
                text: 'Returning to default. World simplifies.',
                options: [
                    { text: 'Accept simple', nextText: 400 },
                    { text: 'Reallocate', nextText: 401 }
                ]
            },
            {
                id: 189,
                text: 'Pushing through pain. Anchors stabilize.',
                options: [
                    { text: 'Complete stabilization', healthChange: -30, setState: { anchorsStabilized: true }, nextText: 402 },
                    { text: 'Cannot continue', nextText: 403 }
                ]
            },
            {
                id: 191,
                text: 'Trying different approach. Consulting notes.',
                options: [
                    { text: 'Find solution', nextText: 406 },
                    { text: 'Still stuck', nextText: 407 }
                ]
            },
            {
                id: 192,
                text: 'Accepting instability. It becomes normal.',
                options: [
                    { text: 'Adapt', setState: { adaptedToGlitches: true }, nextText: 408 },
                    { text: 'Keep trying', nextText: 409 }
                ]
            },
            {
                id: 193,
                text: 'Fighting wolf. It fights with glitches.',
                options: [
                    { text: 'Continue fight', healthChange: -35, setState: { foughtWolf: true }, nextText: 410 },
                    { text: 'Try talk again', nextText: 411 }
                ]
            },
            {
                id: 194,
                text: 'Talking to wolf. It understands you.',
                options: [
                    { text: 'Ask questions', setState: { wolfFriend: true }, nextText: 412 },
                    { text: 'Make friend', nextText: 413 }
                ]
            },
            {
                id: 195,
                text: 'Entering cave. Walls are made of code.',
                options: [
                    { text: 'Explore cave', nextText: 414 },
                    { text: 'Read walls', nextText: 415 }
                ]
            },
            {
                id: 196,
                text: 'Examining waterfall. It\'s rendering water.',
                options: [
                    { text: 'Study rendering', nextText: 416 },
                    { text: 'Enter anyway', nextText: 417 }
                ]
            },
            {
                id: 197,
                text: 'Taking contents: debug key fragment.',
                options: [
                    { text: 'Use fragment', setState: { hasKeyFragment: true }, nextText: 418 },
                    { text: 'Keep searching', nextText: 419 }
                ]
            },
            {
                id: 198,
                text: 'Leaving it. Compartment closes.',
                options: [
                    { text: 'Regret decision', nextText: 420 },
                    { text: 'Move on', nextText: 421 }
                ]
            },
            {
                id: 199,
                text: 'Beginning creation. World responds.',
                options: [
                    { text: 'Create landscape', setState: { createdLandscape: true }, nextText: 422 },
                    { text: 'Create NPC', nextText: 423 }
                ]
            },
            {
                id: 200,
                text: 'Seeking guidance. World whispers answers.',
                options: [
                    { text: 'Listen closely', metaGain: 15, nextText: 424 },
                    { text: 'Ignore whispers', nextText: 425 }
                ]
            },

            // ========== SCENES 201-240: FINAL PATHS TO ENDINGS ==========
            {
                id: 201,
                text: 'Forcing bypass. System fights back.',
                options: [
                    { text: 'Force harder', healthChange: -30, nextText: 426 },
                    { text: 'Stop forcing', nextText: 427 }
                ]
            },
            {
                id: 203,
                text: 'Modifying function. Effects ripple.',
                options: [
                    { text: 'Watch effects', nextText: 430 },
                    { text: 'Undo modification', nextText: 431 }
                ]
            },
            {
                id: 204,
                text: 'Releasing function. It rejoins river.',
                options: [
                    { text: 'Release more', nextText: 432 },
                    { text: 'Keep next', nextText: 433 }
                ]
            },
            {
                id: 205,
                text: 'Swimming in lake. Code enters mind.',
                options: [
                    { text: 'Swim deeper', metaGain: 40, healthChange: -35, nextText: 434 },
                    { text: 'Get out', nextText: 435 }
                ]
            },
            {
                id: 206,
                text: 'Studying shoreline. Patterns emerge.',
                options: [
                    { text: 'Study patterns', metaGain: 20, nextText: 436 },
                    { text: 'Follow patterns', nextText: 437 }
                ]
            },
            {
                id: 207,
                text: 'Making more changes. World transforms.',
                options: [
                    { text: 'Keep changing', setState: { changedWorld: true }, nextText: 438 },
                    { text: 'Too much change', nextText: 439 }
                ]
            },
            {
                id: 208,
                text: 'Restoring flow. World returns normal.',
                options: [
                    { text: 'Keep restored', nextText: 440 },
                    { text: 'Prefer changed', nextText: 441 }
                ]
            },
            {
                id: 209,
                text: 'Studying structure. Understanding grows.',
                options: [
                    { text: 'Study more', metaGain: 25, nextText: 442 },
                    { text: 'Use knowledge', nextText: 443 }
                ]
            },
            {
                id: 210,
                text: 'Jumping to element. Teleportation works.',
                options: [
                    { text: 'Jump again', setState: { teleported: true }, nextText: 444 },
                    { text: 'Stay here', nextText: 445 }
                ]
            },
            {
                id: 211,
                text: 'Touching waterfall. Styles apply to you.',
                options: [
                    { text: 'Enjoy styles', setState: { styled: true }, nextText: 446 },
                    { text: 'Remove styles', nextText: 447 }
                ]
            },
            {
                id: 212,
                text: 'Studying rules. They\'re beautiful.',
                options: [
                    { text: 'Memorize rules', setState: { memorizedRules: true }, nextText: 448 },
                    { text: 'Modify rules', nextText: 449 }
                ]
            },
            {
                id: 213,
                text: 'Reading another comment. More procrastination.',
                options: [
                    { text: 'Read all', metaGain: 10, nextText: 450 },
                    { text: 'Stop reading', nextText: 451 }
                ]
            },
            {
                id: 214,
                text: 'Adding squirrels. They appear instantly.',
                options: [
                    { text: 'Watch squirrels', nextText: 452 },
                    { text: 'Add more animals', nextText: 453 }
                ]
            },
            {
                id: 215,
                text: 'Feeling sympathy for past self.',
                options: [
                    { text: 'Forgive self', setState: { forgaveSelf: true }, nextText: 454 },
                    { text: 'Stay frustrated', nextText: 455 }
                ]
            },
            {
                id: 216,
                text: 'Fixing collision now. It finally works.',
                options: [
                    { text: 'Celebrate', setState: { fixedCollision: true }, nextText: 456 },
                    { text: 'Fix more systems', nextText: 457 }
                ]
            },
            {
                id: 217,
                text: 'Keeping fixing. Exhaustion sets in.',
                options: [
                    { text: 'Push through exhaustion', healthChange: -40, metaGain: 30, nextText: 458 },
                    { text: 'Rest now', nextText: 459 }
                ]
            },
            {
                id: 218,
                text: 'Taking break. Energy slowly returns.',
                options: [
                    { text: 'Rest more', healthChange: 30, nextText: 460 },
                    { text: 'Return work', nextText: 461 }
                ]
            },
            {
                id: 219,
                text: 'Exploring cut features. Lost potential.',
                options: [
                    { text: 'Revive features', setState: { revivedFeatures: true }, nextText: 462 },
                    { text: 'Leave cut', nextText: 463 }
                ]
            },
            {
                id: 220,
                text: 'Returning physical. Code Realm fades.',
                options: [
                    { text: 'Miss Code Realm', nextText: 464 },
                    { text: 'Glad return', nextText: 465 }
                ]
            },
            {
                id: 221,
                text: 'Resting in stable area. Peaceful.',
                options: [
                    { text: 'Rest longer', healthChange: 50, nextText: 466 },
                    { text: 'Explore area', nextText: 467 }
                ]
            },
            {
                id: 222,
                text: 'Studying stability. It\'s well-coded.',
                options: [
                    { text: 'Learn from it', metaGain: 35, nextText: 468 },
                    { text: 'Replicate stability', nextText: 469 }
                ]
            },
            {
                id: 223,
                text: 'Accepting help. NPC guides you.',
                options: [
                    { text: 'Follow guide', nextText: 470 },
                    { text: 'Ask questions', nextText: 471 }
                ]
            },
            {
                id: 225,
                text: 'Reshaping more. World becomes perfect.',
                options: [
                    { text: 'Perfect everything', setState: { perfectedWorld: true }, nextText: 474 },
                    { text: 'Stop perfecting', nextText: 475 }
                ]
            },
            {
                id: 226,
                text: 'Restoring glitches. Character returns.',
                options: [
                    { text: 'Restore all glitches', nextText: 476 },
                    { text: 'Keep some perfect', nextText: 477 }
                ]
            },
            {
                id: 227,
                text: 'Touching nexus. Ultimate power.',
                options: [
                    { text: 'Use power to escape', requiredState: (state) => state.player.metaKnowledge >= 100, nextText: 478 },
                    { text: 'Use power to stay', requiredState: (state) => state.promisedToFinish === true, nextText: 479 },
                    { text: 'Fear the power', nextText: 480 }
                ]
            },
            {
                id: 228,
                text: 'Analyzing nexus. It\'s the game engine.',
                options: [
                    { text: 'Study engine', metaGain: 45, nextText: 481 },
                    { text: 'Modify engine', healthChange: -60, nextText: 482 }
                ]
            },
            {
                id: 229,
                text: 'Keeping fixing. Forest becomes generic.',
                options: [
                    { text: 'Accept generic', nextText: 483 },
                    { text: 'Stop fixing', nextText: 484 }
                ]
            },
            {
                id: 230,
                text: 'Leaving glitches. Forest unique again.',
                options: [
                    { text: 'Appreciate uniqueness', nextText: 485 },
                    { text: 'Still fix some', nextText: 486 }
                ]
            },
            {
                id: 231,
                text: 'Feeling despair. Overwhelming task.',
                options: [
                    { text: 'Give up completely', setState: { gaveUp: true }, nextText: 487 },
                    { text: 'Find hope', nextText: 488 }
                ]
            },
            {
                id: 232,
                text: 'Finding purpose. Maybe not fixing.',
                options: [
                    { text: 'Find new purpose', nextText: 489 },
                    { text: 'Still try fix', nextText: 490 }
                ]
            },
            {
                id: 233,
                text: 'Fixing allocation. Memory stabilizes.',
                options: [
                    { text: 'Fix more systems', setState: { fixedMemory: true }, nextText: 491 },
                    { text: 'Test fixes first', nextText: 492 }
                ]
            },
            {
                id: 234,
                text: 'Creating assets. Filling gaps.',
                options: [
                    { text: 'Create more assets', setState: { createdAssets: true }, nextText: 493 },
                    { text: 'Use existing assets', nextText: 494 }
                ]
            },
            {
                id: 235,
                text: 'Talking to creation. It thanks you.',
                options: [
                    { text: 'Talk more', nextText: 495 },
                    { text: 'Create companion', nextText: 496 }
                ]
            },
            {
                id: 236,
                text: 'Writing more. Story expands.',
                options: [
                    { text: 'Write epic story', setState: { wroteEpic: true }, nextText: 497 },
                    { text: 'Write simple story', nextText: 498 }
                ]
            },
            {
                id: 237,
                text: 'Adding flags. Quest can progress.',
                options: [
                    { text: 'Complete quest', setState: { completedQuest: true }, nextText: 499 },
                    { text: 'Add more quests', nextText: 500 }
                ]
            },
            {
                id: 239,
                text: 'Fixing islands. They float again.',
                options: [
                    { text: 'Fix all islands', nextText: 503 },
                    { text: 'Leave some crashed', nextText: 504 }
                ]
            },
            {
                id: 240,
                text: 'Reverting gravity. Islands rise.',
                options: [
                    { text: 'Keep reverted', nextText: 505 },
                    { text: 'Adjust carefully', nextText: 506 }
                ]
            },
            {
                id: 241,
                text: 'Mapping boundaries. Creating map.',
                options: [
                    { text: 'Complete map', setState: { completedMap: true }, nextText: 507 },
                    { text: 'Use map now', nextText: 508 }
                ]
            },
            {
                id: 242,
                text: 'Fixing collision. Everything solid.',
                options: [
                    { text: 'Test thoroughly', nextText: 509 },
                    { text: 'Celebrate success', setState: { collisionFixed: true }, nextText: 510 }
                ]
            },

            // ========== FINAL DECISION SCENES ==========
            {
                id: 243,
                text: 'You reach a critical decision point. All paths converge here.',
                options: [
                    { text: 'Choose to escape', requiredState: (state) => state.player.metaKnowledge >= 100, nextText: 511 },
                    { text: 'Choose to stay', requiredState: (state) => state.promisedToFinish === true, nextText: 512 },
                    { text: 'Need more preparation', nextText: 244 }
                ]
            },
            {
                id: 244,
                text: 'You need more preparation before making the final choice.',
                options: [
                    { text: 'Gather more knowledge', requiredState: (state) => state.player.metaKnowledge < 100, nextText: 513 },
                    { text: 'Strengthen connection', requiredState: (state) => !state.promisedToFinish, nextText: 514 },
                    { text: 'Return to Nexus', requiredState: (state) => state.enteredCodeRealm, nextText: 227 },
                    { text: 'Return to start', nextText: 1 }
                ]
            },
            {
                id: 321,
                text: 'You fall through the Core Glitch. Reality fragments around you. You see both the game world and your office simultaneously.',
                options: [
                    { text: 'Reach for your office', requiredState: (state) => state.player.metaKnowledge >= 80, nextText: 511 },
                    { text: 'Embrace the game world', requiredState: (state) => state.promisedToFinish, nextText: 512 },
                    { text: 'Try to balance both', nextText: 322 }
                ]
            },
            {
                id: 322,
                text: 'You attempt to repair the Core Glitch from within.',
                options: [
                    { text: 'Patch with code', requiredState: (state) => state.player.class === 'code-mage', healthChange: -40, nextText: 517 },
                    { text: 'Bend reality around it', requiredState: (state) => state.player.class === 'reality-bender', nextText: 517 },
                    { text: 'Understand its purpose', requiredState: (state) => state.player.class === 'lore-master', nextText: 517 },
                    { text: 'Accept the glitch', nextText: 114 }
                ]
            },

            // ========== CONVERGENCE SCENES ==========
            {
                id: 269,
                text: 'Following the spiral leads you to the Nexus. The Core Glitch pulses at its center.',
                options: [
                    { text: 'Enter the Nexus', nextText: 227 },
                    { text: 'Turn back', nextText: 270 }
                ]
            },
            {
                id: 270,
                text: 'You turn back from the spiral. The path leads to familiar ground.',
                options: [
                    { text: 'Return to forest', nextText: 8 },
                    { text: 'Try different path', nextText: 244 }
                ]
            },
            {
                id: 283,
                text: 'Times remain synced. The world feels stable but restrictive.',
                options: [
                    { text: 'Continue exploring', nextText: 244 },
                    { text: 'Seek the Nexus', nextText: 227 }
                ]
            },
            {
                id: 284,
                text: 'Returning to time dilation. You feel disconnected.',
                options: [
                    { text: 'Continue anyway', nextText: 244 },
                    { text: 'Re-sync times', nextText: 130 }
                ]
            },

            // ========== ESCAPE ENDING PATH ==========
            {
                id: 511,
                text: 'You gather all your knowledge and prepare to escape. The game world recognizes your intent.',
                options: [
                    { text: 'Execute escape sequence', nextText: 515 },
                    { text: 'Last chance to stay', nextText: 516 }
                ]
            },
            {
                id: 515,
                text: 'ESCAPE ENDING\n\nWith ultimate understanding, you rewrite the fundamental rules of your own existence. The error threads connecting you to this world shimmer and dissolve one by one. The game world stabilizes as you extract your consciousness.\n\nYou wake at your computer, the game running normally on screen. The cursor blinks. Your coffee is still warm.\n\nBut part of you remains in Glitchwood. You can still feel the digital wind, hear the pixelated birds, sense the unfinished quests calling. You\'re free, but changed forever.\n\nYou save the game and finally, after all this time, complete the development.',
                options: [
                    { text: 'Start Over', nextText: 1 }
                ]
            },

            // ========== TRAPPED ENDING PATH ==========
            {
                id: 512,
                text: 'You look at your creation and realize it needs you. This world, broken as it is, is yours. The characters, the stories, the very code - it all calls for completion.',
                options: [
                    { text: 'Commit to staying forever', nextText: 517 },
                    { text: 'Last chance to escape', nextText: 518 }
                ]
            },
            {
                id: 517,
                text: 'TRAPPED ENDING\n\nYou choose to complete what you started. You pour your consciousness into the game, fixing every bug, finishing every quest, giving life to every character. The world becomes whole and beautiful under your care.\n\nYears pass in the real world. Your game becomes legendary, downloaded millions of times. Players marvel at how alive it feels, how every NPC seems to have a soul. No one knows why.\n\nYou\'ve become part of your creation, a digital god in a world you perfected. The line between creator and creation blurs until there is no distinction.\n\nYou are home.',
                options: [
                    { text: 'Start Over', nextText: 1 }
                ]
            },

            // ========== ALTERNATIVE ENDINGS ==========
            {
                id: 516,
                text: 'You hesitate at the last moment. The escape sequence aborts.\n\nThe game world sighs in relief. "We knew you wouldn\'t leave us," whispers the forest.\n\nYou are trapped forever, but at peace with your choice.',
                options: [
                    { text: 'Accept this fate', nextText: 517 },
                    { text: 'Try again later', nextText: 243 }
                ]
            },
            {
                id: 518,
                text: 'At the last moment, you try to escape. But your connection to the world is too strong now.\n\nThe attempt fails. You are irrevocably part of the game.\n\nThe world welcomes you home.',
                options: [
                    { text: 'Accept your fate', nextText: 517 },
                    { text: 'Resist futilely', nextText: 519 }
                ]
            },
            {
                id: 519,
                text: 'You resist your fate, fighting against the inevitable. The struggle causes glitches and pain, but changes nothing.\n\nEventually, exhausted, you accept what cannot be changed.',
                options: [
                    { text: 'Finally accept', nextText: 517 }
                ]
            },

            // ========== ADDITIONAL CONVERGENCE SCENES ==========
            {
                id: 478,
                text: 'Using the Nexus power, you begin the escape sequence. Reality bends to your will.',
                options: [
                    { text: 'Complete escape', nextText: 515 },
                    { text: 'Hesitate', nextText: 516 }
                ]
            },
            {
                id: 479,
                text: 'Using the Nexus power, you begin merging with the game world.',
                options: [
                    { text: 'Complete merge', nextText: 517 },
                    { text: 'Hesitate', nextText: 518 }
                ]
            },
            {
                id: 480,
                text: 'You fear the power of the Nexus and step back.',
                options: [
                    { text: 'Return to forest', nextText: 8 },
                    { text: 'Try again later', nextText: 244 }
                ]
            }
        ];
    }

    showScene(sceneId) {
        const scene = this.textNodes.find(node => node.id === sceneId);
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return {
                text: 'The path has vanished. Reality is unstable.',
                options: [
                    { text: 'Return to start', nextText: 1 }
                ]
            };
        }

        this.currentSceneId = sceneId;
        return {
            text: scene.text,
            options: scene.options.filter(option => this.showOption(option))
        };
    }

    showOption(option) {
        if (!option.requiredState) return true;
        return option.requiredState(this.state);
    }

    selectOption(option) {
        // Update game engine state
        if (option.setState) {
            this.state = { ...this.state, ...option.setState };
        }

        // Update player meta knowledge
        if (option.metaGain) {
            gameState.player.metaKnowledge += option.metaGain;
            if (gameState.player.metaKnowledge > 100) {
                gameState.player.metaKnowledge = 100;
            }
            if (gameState.player.metaKnowledge < 0) {
                gameState.player.metaKnowledge = 0;
            }
        }

        // Update player health if specified
        if (option.healthChange) {
            gameState.player.health += option.healthChange;
            if (gameState.player.health > gameState.player.maxHealth) {
                gameState.player.health = gameState.player.maxHealth;
            }
            if (gameState.player.health <= 0) {
                return 0; // Game over
            }
        }

        // Update level based on meta knowledge
        const newLevel = Math.floor(gameState.player.metaKnowledge / 20) + 1;
        if (newLevel > gameState.player.level) {
            gameState.player.level = newLevel;
            gameState.player.maxHealth += 20;
            gameState.player.health = gameState.player.maxHealth;
        }

        return option.nextText;
    }

    getCurrentScene() {
        return this.showScene(this.currentSceneId);
    }

    save() {
        return {
            engineState: this.state,
            currentSceneId: this.currentSceneId,
            gameState: gameState
        };
    }

    load(saveData) {
        this.state = saveData.engineState || {};
        this.currentSceneId = saveData.currentSceneId || 1;
        Object.assign(gameState, saveData.gameState);
    }
}

// DOM ELEMENTS 
const startScreen = document.getElementById('start-screen');
const characterScreen = document.getElementById('character-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameInput = document.getElementById('player-name-input');
const startGameBtn = document.getElementById('start-game-btn');
const nameDisplay = document.getElementById('name-display');
const displayPlayerName = document.getElementById('display-player-name');
const displayPlayerClass = document.getElementById('display-player-class');

//  GAME ENGINE INSTANCE 
const gameEngine = new GameEngine();

//  EVENT LISTENERS 
playerNameInput.addEventListener('input', function () {
    const name = this.value.trim();
    startGameBtn.disabled = name.length < 2;
});

startGameBtn.addEventListener('click', function () {
    if (playerNameInput.value.trim().length >= 2) {
        gameState.player.name = playerNameInput.value.trim().toUpperCase();
        showScreen('character');
        updateNameDisplay();
    }
});

// Character Class Selection
document.querySelectorAll('.class-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.class-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');
        updateClassDescription(this.dataset.class);
    });
});

// Confirm Character
document.getElementById('confirm-character').addEventListener('click', function () {
    const selectedClass = document.querySelector('.class-option.active');
    if (selectedClass) {
        gameState.player.class = selectedClass.dataset.class;
        showScreen('game');
        initializeGame();
    }
});

// Back to Name
document.getElementById('back-to-name').addEventListener('click', function () {
    showScreen('start');
    playerNameInput.focus();
});

// Debug commands
document.querySelectorAll('.debug-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const command = this.dataset.command;
        handleDebugCommand(command);
    });
});

// Enter key for name input
playerNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !startGameBtn.disabled) {
        startGameBtn.click();
    }
});

//  FUNCTIONS 
function updateClassDescription(className) {
    const descriptions = {
        'code-mage': {
            title: 'CODE MAGE',
            details: [
                '> Can manipulate game code directly',
                '> Access to debug commands',
                '> Weak in physical combat',
                '> High Meta-Knowledge growth'
            ]
        },
        'reality-bender': {
            title: 'REALITY BENDER',
            details: [
                '> Expert in glitch exploitation',
                '> Can bend game physics',
                '> Balanced stats',
                '> Medium Meta-Knowledge growth'
            ]
        },
        'lore-master': {
            title: 'LORE MASTER',
            details: [
                '> Deep game world knowledge',
                '> Better NPC interactions',
                '> Strong in dialogue options',
                '> Low Meta-Knowledge growth'
            ]
        }
    };

    const desc = descriptions[className];
    const descriptionElement = document.getElementById('class-description');

    descriptionElement.innerHTML = `
                <h3>${desc.title}</h3>
                ${desc.details.map(detail => `<p>${detail}</p>`).join('')}
            `;
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName + '-screen').classList.add('active');
    gameState.currentScreen = screenName;
}

function updateNameDisplay() {
    nameDisplay.textContent = `DEVELOPER: ${gameState.player.name}`;
    displayPlayerName.textContent = gameState.player.name;
}

function initializeGame() {
    displayPlayerName.textContent = gameState.player.name;
    displayPlayerClass.textContent = gameState.player.class.replace('-', ' ').toUpperCase();

    // Set class-specific starting stats
    switch (gameState.player.class) {
        case 'code-mage':
            gameState.player.health = 80;
            gameState.player.maxHealth = 80;
            break;
        case 'reality-bender':
            gameState.player.health = 100;
            gameState.player.maxHealth = 100;
            break;
        case 'lore-master':
            gameState.player.health = 120;
            gameState.player.maxHealth = 120;
            break;
    }

    updateUI();
    loadScene(1);
}

function loadScene(sceneId) {
    const scene = gameEngine.showScene(sceneId);
    if (!scene) return;

    gameState.currentScene = sceneId;

    // Update story text
    const storyElement = document.getElementById('story-text');
    storyElement.textContent = scene.text;

    // Update choices
    updateChoices(scene.options);

    // Update UI
    updateUI();

    // Save game state
    saveGame();
}

function updateChoices(options) {
    const choicesContainer = document.getElementById('choices-buttons');
    choicesContainer.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'pixel-btn choice-btn';
        button.textContent = option.text;

        button.addEventListener('click', () => {
            const nextSceneId = gameEngine.selectOption(option);

            if (nextSceneId <= 0) {
                if (nextSceneId === 0) {
                    // Game over
                    gameOver();
                } else if (nextSceneId === -1) {
                    // Restart
                    restartGame();
                }
                return;
            }

            loadScene(nextSceneId);
        });

        choicesContainer.appendChild(button);
    });
}

function updateUI() {
    // Update health bar
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    document.getElementById('health-bar').style.width = healthPercent + '%';
    document.getElementById('health-text').textContent = `${gameState.player.health}/${gameState.player.maxHealth}`;

    // Update meta knowledge bar
    document.getElementById('meta-bar').style.width = gameState.player.metaKnowledge + '%';
    document.getElementById('meta-text').textContent = `${gameState.player.metaKnowledge}/100`;

    // Update level
    document.getElementById('level-text').textContent = gameState.player.level;
}

function handleDebugCommand(command) {
    switch (command) {
        case 'save':
            saveGame();
            showMessage('Game saved successfully!');
            break;
        case 'load':
            loadGame();
            showMessage('Game loaded!');
            break;
        case 'stats':
            const classDescriptions = {
                'code-mage': 'Manipulates game code, debug access, high meta-knowledge growth',
                'reality-bender': 'Bends game physics, glitch expert, balanced stats',
                'lore-master': 'Deep world knowledge, better NPC interactions, low meta-growth'
            };
            
            showMessage(
                `PLAYER STATS:\n` +
                `Name: ${gameState.player.name}\n` +
                `Class: ${gameState.player.class.toUpperCase().replace('-', ' ')}\n` +
                `Description: ${classDescriptions[gameState.player.class] || 'Unknown class'}\n` +
                `Health: ${gameState.player.health}/${gameState.player.maxHealth}\n` +
                `Meta: ${gameState.player.metaKnowledge}/100\n` +
                `Level: ${gameState.player.level}\n` +
                `Inventory: ${gameState.player.inventory.length} items`
            );
            break;
    }
}

function saveGame() {
    try {
        const saveData = {
            player: gameState.player,
            currentScene: gameState.currentScene,
            engineState: gameEngine.state,
            engineScene: gameEngine.currentSceneId
        };
        localStorage.setItem('gameMakerRealmSave', JSON.stringify(saveData));
        console.log('Game saved');
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

function loadGame() {
    try {
        const saveData = localStorage.getItem('gameMakerRealmSave');
        if (saveData) {
            const data = JSON.parse(saveData);

            // Load game state
            gameState.player = data.player;
            gameState.currentScene = data.currentScene;
            gameEngine.state = data.engineState || {};
            gameEngine.currentSceneId = data.engineScene || 1;

            // Update UI
            displayPlayerName.textContent = gameState.player.name;
            displayPlayerClass.textContent = gameState.player.class.replace('-', ' ').toUpperCase();
            updateUI();

            // Load scene
            loadScene(gameEngine.currentSceneId);
        }
    } catch (e) {
        console.error('Failed to load game:', e);
    }
}

function showMessage(message) {
    const storyElement = document.getElementById('story-text');
    const originalText = storyElement.textContent;
    storyElement.textContent = message;
    setTimeout(() => {
        storyElement.textContent = originalText;
    }, 2000);
}

function gameOver() {
    const storyElement = document.getElementById('story-text');
    storyElement.textContent = 'GAME OVER\n\nYour journey ends here. The game world continues without its creator...';
    document.getElementById('choices-buttons').innerHTML = '';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'pixel-btn';
    restartBtn.textContent = 'TRY AGAIN';
    restartBtn.addEventListener('click', restartGame);
    document.getElementById('choices-buttons').appendChild(restartBtn);
}

function restartGame() {
    // Reset game state
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.metaKnowledge = 0;
    gameState.player.level = 1;
    gameState.player.inventory = [];
    gameEngine.state = {};

    // Start from beginning
    loadScene(1);
    updateUI();
}

//  INITIALIZATION 
document.addEventListener('DOMContentLoaded', function () {
    showScreen('start');
    playerNameInput.focus();

    // Try to load saved game
    setTimeout(() => {
        const saveData = localStorage.getItem('gameMakerRealmSave');
        if (saveData) {
            console.log('Save file detected');
        }
    }, 1000);
});