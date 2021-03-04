import Jimp from 'jimp';

export const getBase64 = (img: any): PromiseLike<string> => {
  return new Promise(function(resolve, reject) {
    img.getBase64(Jimp.AUTO, (err: string, str: string) => {
      if (err) return reject(err);
      return resolve(str)
    });
  });
}

//FIX
export const rgba = (r: number, g: number, b: number, a: number=255): number => 0// Jimp.rgbaToInt(r,g,b,a);

export const getImage = async (width: number, height: number) => {
  try {
    return await new Jimp(width, height);
  } catch (err) {
    return err;
  }
}

class BitMap {
  private width: number;
  private height: number;
  private matrix: boolean[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.matrix = new Array(height);
    for (var y=0; y<height; y++) {
      this.matrix[y] = new Array(width).fill(false);
    }
  }

  updateCord(x: number, y: number, val: boolean) {
    this.matrix[y][x] = val;
  }

  refreshMatrix(matrix: number[][]) {
    matrix.forEach((xList, y) => {
      xList.forEach((oldValue, x) => {
        if (oldValue != matrix[y][x])
          xList[x] = matrix[y][x];
      });
    });
  }
}