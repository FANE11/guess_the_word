
var GameScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.wordList = ["ДАР", "РАК", "КАДР", "ДРАКА"]; 
        this.image_folder = "res/letters/rus/";
        this.image_mapping = {
            Д: "d",
            А: "a",
            Р: "r",
            К: "k"
        };
        this.guessedWords = []; 
        this.currentWord = ""; 
        this.coins = 200;
        this.coinLabel = null;
        self = this;
        this.addBackground();
        this.addWordList(this.image_mapping, this.image_folder);
        this.addLetterSelection(this.wordList, this.image_mapping, this.image_folder);
        this.addCoinLabel = new AddCoinLabel(this);
        this.addHintButton = new AddHintButton(this);
        //this.buyHint = new buyHint(this);

    },


    
    addLetterSelection: function (wordList, image_mapping, image_folder) {
        var self = this;
        var letterSelection = new cc.Layer();
        var alphabet = [];

        var numLetters = 0;
        var radius = 100;
        var centerX = cc.winSize.width / 2;
        var centerY = 100 + radius - 50;

        for (let i = 0; i < wordList.length; i++) {
            const word = wordList[i];

            for (let j = 0; j < word.length; j++) {
                const symbol = word[j];

                if (!alphabet.includes(symbol)) {
                    alphabet.push(symbol);
                }
            }
        }

        numLetters = alphabet.length;

        for (var i = 0; i < numLetters; i++) {
            var angle = i * (2 * Math.PI / numLetters);
            var x = centerX + radius * Math.sin(angle);
            var y = centerY - radius * Math.cos(angle);

            var symbol = alphabet[i];
            var imageSymbol = image_mapping[symbol];
            var imageSrc = image_folder + imageSymbol + ".png";
            var imageSprite = new cc.Sprite(imageSrc);

            imageSprite.setPosition(cc.p(x, y));

            letterSelection.addChild(imageSprite);
            imageSprite.setTag(i);

            imageSprite.setScale(1);
            var scaleAction = cc.scaleBy(0.1, 1.2);
            var scaleBackAction = cc.scaleBy(0.1, 1 / 1.2);

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: (touch, event) => {
                    var target = event.getCurrentTarget();
                    var location = target.convertToNodeSpace(touch.getLocation());
                    var size = target.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);

                    if (cc.rectContainsPoint(rect, location)) {
                        var letterIndex = target.getTag();
                        var letter = alphabet[letterIndex];

                        //console.log("Буква: " + letter);
                        self.checkWord(letter);

                        
                        target.runAction(cc.sequence(scaleAction, scaleBackAction));
                        return true;
                    }
                    return false;
                }
            }, imageSprite);
        }

        this.addChild(letterSelection);
    },


    
        showGuessedWord: function (word) {
        var wordLayer = new cc.Layer();
        var startX = cc.winSize.width / 2 - 100;
        var startY = cc.winSize.height / 2;
    
        for (var i = 0; i < word.length; i++) {
            var symbol = word[i];
            var imageSymbol = this.image_mapping[symbol];
            var imageSrc = this.image_folder + imageSymbol + ".png";
            var imageSprite = new cc.Sprite(imageSrc);
            imageSprite.setPosition(startX + i * 70, startY);
            imageSprite.setOpacity(0); 
            wordLayer.addChild(imageSprite);
    
           
            var delayAction = cc.delayTime(i * 0.2);
            var fadeInAction = cc.fadeIn(0.5);
            var fadeOutAction = cc.sequence(
                cc.delayTime(1.5), 
                cc.fadeOut(0.5),
                cc.callFunc(() => {
                    wordLayer.removeFromParent();
                })
            );
    
           
            imageSprite.runAction(cc.sequence(delayAction, fadeInAction, fadeOutAction));
        }
    
        this.addChild(wordLayer);
    },
    

    
    onLetterButtonPressed: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            var letter = sender.getTitleText();
            this.checkWord(letter);
        }
    },

    
    checkWord: function (letter) {
        this.currentWord += letter;

        var targetWord = this.wordList.find(word => word.startsWith(this.currentWord));

        if (targetWord) {
            if (targetWord === this.currentWord) {
                this.guessedWords.push(targetWord);
                //console.log("Слово угадано: " + targetWord);
                this.currentWord = "";

                this.showGuessedWord(targetWord);
            }
        } else {
            this.currentWord = "";
            //console.log("Неверная комбинация букв");
        }

        
        this.addWordList(this.image_mapping, this.image_folder, targetWord);
    },

    
    addWordList: function (image_mapping, image_folder, targetWord) {
        var wordListLayer = this.getChildByName("wordList");
        if (!wordListLayer) {
            wordListLayer = new cc.Layer();
            wordListLayer.setName("wordList");
            this.addChild(wordListLayer);
        }
        wordListLayer.removeAllChildren();
    
        var startX = cc.winSize.width / 2;
        var startY = cc.winSize.height / 2 + 400;
        var spacingY = 90;
    
        for (var i = 0; i < this.wordList.length; i++) {
            var word = this.wordList[i];
            var wordLayer = new cc.Layer();
    
            for (var j = 0; j < word.length; j++) {
                var symbol = word[j];
    
                var bgSprite = new cc.Sprite("res/game/letter_bg.png");
                bgSprite.setPosition(startX + (j - Math.floor(word.length / 2)) * spacingY, startY - i * spacingY);
                wordLayer.addChild(bgSprite);
    
                if (this.guessedWords.includes(word)) {
                    var imageSymbol = image_mapping[symbol];
                    var imageSrc = image_folder + imageSymbol + ".png";
                    var imageSprite = new cc.Sprite(imageSrc);
                    imageSprite.setPosition(startX + (j - Math.floor(word.length / 2)) * spacingY, startY - i * spacingY);
                    imageSprite.setOpacity(0); 
                    wordLayer.addChild(imageSprite);
    
                    
                    if (word === targetWord) {
                        imageSprite.runAction(cc.sequence(
                            cc.delayTime(0.1 * j), 
                            cc.fadeIn(0.5) 
                        ));
                    } else {
                        imageSprite.setOpacity(255); 
                    }
                }
            }
    
            if (this.guessedWords.includes(word)) {
                wordLayer.setColor(cc.color(0, 255, 0));
            }
    
            if (this.guessedWords.length === this.wordList.length) {
                this.showVictoryMessage();
            }
    
            wordListLayer.addChild(wordLayer);
        }
    },


    showVictoryMessage: function () {
        var victoryLabel = new cc.LabelTTF("Вы выиграли!", "Arial", 36);
        victoryLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        victoryLabel.setColor(cc.color(255, 255, 0)); 
        this.addChild(victoryLabel);
    },

    buyHint: function () {
        if (this.coins >= 50) {
            this.coins -= 50;
            this.showHint = new ShowHint(this);
            this.updateCoinLabel = new UpdateCoinLabel(this);
        } else {
            //console.log("Недостаточно монет для покупки подсказки");
        }
    },

    
    

    onHintButtonPressed: function (sender, type) {
        var addHintButton = new AddHintButton(this);
        var player = {
            coins: 100
          };
        if (type === ccui.Widget.TOUCH_ENDED) {
            //console.log("Подсказка");
            this.buyHint();
        }
    },

    
    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },
});

var gameScene = new GameScene();
cc.director.runScene(gameScene);