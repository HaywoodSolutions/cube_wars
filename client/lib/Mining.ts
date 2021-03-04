import firebase, { db } from '../lib/Firebase';
import deviceId from '../lib/Device';

const secondsUntilUpdateServer: number = 2;

export const bonusFactors: {[amount: number]: number} = {
  0: 1,
  20: 2,
  40: 3,
  80: 4,
  160: 5,
  270: 6,
  440: 7,
  750: 8,
  1300: 9,
  2000: 10,
  3200: 11,
  5000: 12
}

class Mining {
  private lastClick: number = new Date().getTime();
  private amount: number = 0;
  private listerning: boolean = false;
  private cords: {
    [tileId: string]: {
      [cordId: string]: boolean
    }
  } = {};

  private countListerner: Function = () => {};
  private messageListerner: Function = () => {};

  mountAmountListerner(func: Function): void {
    this.countListerner = func;
  }

  unmountAmountListerner(): void {
    this.countListerner = function() {};
  }

  mountMessageListerner(func: Function): void {
    this.messageListerner = func;
  }

  unmountMessageListerner(): void {
    this.messageListerner = function() {};
  }

  listern(): void {
    this.listerning = true;
    let self = this;
    setTimeout(function() {
      if (self.lastClick < new Date().getTime() - 1000 * secondsUntilUpdateServer) {
        self.stopListening();
      } else {
        self.listern();
      }
    }, 100);
  }

  stopListening(): Promise<void> {
    this.listerning = false;
    const batch = db.batch();

    for (let tileCord in this.cords) {
      const tileRef = db.collection("tiles").doc(tileCord)
      batch.update(tileRef, this.cords[tileCord]);
    }

    const userRef = db.collection("users").doc(deviceId);  
    const bonusAmount = bonusFactors[Math.max(...Object.keys(bonusFactors).filter((v) => parseInt(v) < this.amount).map(v => parseInt(v)))];
    
    const totalCoins = this.amount * bonusAmount;
    batch.update(userRef, {
      money: firebase.firestore.FieldValue.increment(totalCoins),
      [`stats.totalMined`]: firebase.firestore.FieldValue.increment(this.amount),
    });

    this.countListerner(0);
    this.cords = {};
    this.amount = 0;

    return batch.commit().then(() => {
      this.messageListerner({
        title: 'Gained',
        message: `${totalCoins} coins`
      }); 
    });
  }

  mineCube(tileCord: {x: number, y; number}, x: number, y: number): void {
    this.lastClick = new Date().getTime();
    if (!this.cords[tileCord.x + "," + tileCord.y])
      this.cords[tileCord.x + "," + tileCord.y] = {};
    this.cords[tileCord.x + "," + tileCord.y][`mined.${x}.${y}`] = true;
    this.amount++;
    if (!this.listerning)
      this.listern();

    this.countListerner(this.amount);
    if (bonusFactors[this.amount])
      this.messageListerner({
        title: 'Bonus',
        message: `${bonusFactors[this.amount]}x`
      });
  }
};

export default new Mining();