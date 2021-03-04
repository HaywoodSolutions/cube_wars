import Canvas from './SVG/Canvas';
import Rect from './SVG/Rect'
import { HashToBinary } from './HashLogic';

export default class TileSVG {
  private str: string;
  private binaryStr: string;
  private tileSize: number;
  private cubeSize: number

	constructor(
    hash: string = "0",
    tileSize: number = 256,
    cubeSize: number = 5
  ) {
    this.tileSize = tileSize;
    this.cubeSize = cubeSize;
    this.binaryStr = HashToBinary(hash);
    this.str = this.toString();
	}
	
	toString() {
    console.log(this.binaryStr.length)
    console.log(this.binaryStr.match(/.{1,256}/g).reduce((list: string[], v: string, y: number): string[] => {
          for (let x=0; x<v.length; x++)
          if (v.substring(x, x+1) == "1")
          list.push(Rect({
              x,
              y,
              width: this.cubeSize,
              height: this.cubeSize
            }, {
              fill: '#000'
            })).toString();
        return list;
      }, []).toString()
    );
		if (!this.str)
			this.str = Canvas(
        {
          width: this.tileSize * this.cubeSize,
          height: this.tileSize * this.cubeSize
        },
        this.binaryStr.match(/.{1,256}/g).reduce((list: string[], v: string, y: number): string[] => {
          for (let x=0; x<v.length; x++)
            if (v.substring(x, x+1) == "1")
            list.push(Rect({
                x,
                y,
                width: this.cubeSize,
                height: this.cubeSize
              }, {
                fill: '#000'
              })).toString();
          return list;
        }, [])
      ).toString();
    return this.str;
  }
}