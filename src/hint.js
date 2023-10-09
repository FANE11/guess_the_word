
var AddHintButton = function(self){

    var hintButtonContainer = new cc.Node();
    hintButtonContainer.setPosition(cc.winSize.width - 20, 30);
    self.addChild(hintButtonContainer);

    var hintButton = new ccui.Button();
    hintButton.setTitleText("Подсказка");
    hintButton.setTitleFontSize(36);
    hintButton.setAnchorPoint(1, 0);
    hintButton.setPosition(0, 0);
    hintButtonContainer.addChild(hintButton);

    var bgSprite = new cc.Sprite("res/game/letter_bg.png");
    bgSprite.setPosition(-115, 20);
    hintButtonContainer.addChild(bgSprite, -1);
    bgSprite.setScaleX(2.5);

    hintButton.addTouchEventListener(self.onHintButtonPressed, self);
    hintButton.setContentSize(cc.size(200, 100));
    hintButton.setColor(cc.color(0, 255, 0));

    this.showHint =  function (self) {
      var remainingWords = this.wordList.filter(word => !this.guessedWords.includes(word));

      /*
      if (remainingWords.length === 0) {
          console.log("Все слова уже отгаданы");
          return;
      }
      */

      var symbol = remainingWords[0].charAt(0);
      var imageSymbol = this.image_mapping[symbol];
      var imageSrc = this.image_folder + imageSymbol + ".png";
      var hintSprite = new cc.Sprite(imageSrc);
      hintSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 80);
      this.addChild(hintSprite);

      var fadeOutAction = cc.sequence(
          cc.delayTime(1.8),
          cc.fadeOut(0.5),
          cc.callFunc(() => {
              hintSprite.removeFromParent();
          })
      );
      hintSprite.runAction(fadeOutAction);

      var fadeOutAction = cc.sequence(
          cc.delayTime(1.8),
          cc.fadeOut(0.5),
          cc.callFunc(() => {
              hintLabel.removeFromParent();
          })
      );

  }},
 AddCoinLabel = function (self) {
    var coinLabelContainer = new cc.Node();
    coinLabelContainer.setPosition(cc.winSize.width - 30, cc.winSize.height - 30);
    self.addChild(coinLabelContainer);

    var bgSprite = new cc.Sprite("res/game/letter_bg.png");
    bgSprite.setPosition(-75, -15);
    coinLabelContainer.addChild(bgSprite);
    bgSprite.setScaleX(2.2);

    self.coinLabel = new cc.LabelTTF("Монеты: " + self.coins, "Arial", 24);
    self.coinLabel.setAnchorPoint(1, 1);
    self.coinLabel.setPosition(0, 0);
    self.coinLabel.setFontFillColor(cc.color(255, 255, 0));
    coinLabelContainer.addChild(self.coinLabel);
},
UpdateCoinLabel = function (self) {
    if (self.coinLabel) {
        self.coinLabel.setString("Монеты: " + self.coins);
    }
},
ShowHint =  function (self) {
    var remainingWords = self.wordList.filter(word => !self.guessedWords.includes(word));

    /*
    if (remainingWords.length === 0) {
        console.log("Все слова уже отгаданы");
        return;
    }
    */

    var symbol = remainingWords[0].charAt(0);
    var imageSymbol = self.image_mapping[symbol];
    var imageSrc = self.image_folder + imageSymbol + ".png";
    var hintSprite = new cc.Sprite(imageSrc);
    hintSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 80);
    self.addChild(hintSprite);

    var fadeOutAction = cc.sequence(
        cc.delayTime(1.8),
        cc.fadeOut(0.5),
        cc.callFunc(() => {
            hintSprite.removeFromParent();
        })
    );
    hintSprite.runAction(fadeOutAction);

    var fadeOutAction = cc.sequence(
        cc.delayTime(1.8),
        cc.fadeOut(0.5),
        cc.callFunc(() => {
            hintLabel.removeFromParent();
        })
    );

};

