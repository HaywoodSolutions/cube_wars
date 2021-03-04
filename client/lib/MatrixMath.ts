import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';
import {
  Animated
} from 'react-native';

export const rotateXY = (dx: number, dy: number): number[] => {
  const radX = (Math.PI / 180) * dy;
  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);

  const radY = (Math.PI / 180) * -dx;
  const cosY= Math.cos(radY);
  const sinY = Math.sin(radY);

  return [
    cosY, sinX * sinY, cosX * sinY, 0,
    0, cosX, -sinX, 0,
    -sinY, cosY * sinX, cosX * cosY, 0,
    0, 0, 0, 1
  ];
};

export const rotateCosSin = (dx: number, dy: number): { cos: { x: number, y: number }, sin: { x: number, y: number } } => {
  const radX = (Math.PI / 180) * dy;
  const radY = (Math.PI / 180) * -dx;

  return {
    cos: {
      x: Math.cos(radX),
      y: Math.cos(radY)
    },
    sin: {
      x: Math.sin(radX),
      y: Math.sin(radY)
    }
  };
};

export const rotateXZ = (dx: number, dy: number): number[] => {
  const radX = (Math.PI / 180) * dx;
  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);

  const radY = (Math.PI / 180) * dy;
  const cosY= Math.cos(radY);
  const sinY = Math.sin(radY);

  return [
    cosX, -cosY * sinX, sinX * sinY, 0,
    sinX, cosX * cosY, -sinY * cosX, 0,
    0, sinY, cosY, 0,
    0, 0, 0, 1
  ];
};

//source: https://gist.github.com/jmurzy/0d62c0b5ea88ca806c16b5e8a16deb6a#file-foldview-transformutil-transformorigin-js
export const transformOrigin = (matrix: number[], origin: {x: number, y: number, z: number}) => {
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);
};