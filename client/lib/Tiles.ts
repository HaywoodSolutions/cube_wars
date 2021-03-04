import { db } from '../lib/Firebase';
import { Side } from '../components/CubeSide';
import { AsyncStorage } from 'react-native';

const defaultTile = (level: number, x: number, y: number, hex: string = "0") => ({
  level,
  cord: {
    x,
    y
  },
  hex
});

export default class TileManager {

  static async setInStorage(storageId: string, data: any) {
    try {
      data.lastUpdated = new Date().getTime();
      await AsyncStorage.setItem(storageId, JSON.stringify(data));
    } catch (error) {
      // Error saving data
    }
  }

  static async getFromStorage(storageId: string): Promise<{present: boolean, value?: any}> {
    try {
      const value = await AsyncStorage.getItem(storageId);
      if (value !== null) {
        return {
          present: true,
          value
        }
      } else {
        return {
          present: false
        };
      }
    } catch (error) {
      return {
        present: false
      }
    }
  }

  static setTileInStorage(tileId: string, data: any) {
    return this.setInStorage(`@Tiles:${tileId}`, data);
  }

  static async getTileFromStorage(tileId: string): Promise<{present: boolean, value?: any}> {
    return this.getFromStorage(`@Tiles:${tileId}`);
  }

  static getTile(side: Side, level: number, x: number, y: number) {
    const tileId: string = `S${side}.L${level}.X${x}.Y${y}`;
    return this.getTileFromStorage(tileId).then((data) => {
      if (data.present) {
        const value = JSON.parse(data.value);
        if (value.lastUpdated > new Date().getTime() - 1000 * 60 * 5)
          return value;
      }
      const tileRef = db.collection("tile").doc(tileId);
      return tileRef.get().then(doc => {
        if (!doc.exists) {
          return defaultTile(level, x, y);
        } else {
          const tileData = doc.data();
          this.setTileInStorage(tileId, defaultTile(level, x, y, tileData.hex));
          return defaultTile(level, x, y, tileData.hex);
        }
      });
    });
  }

  static getLayerBackground(layer: number) {
    const tileRef = db.collection("layerBackgrounds").doc(layer.toString());
    return tileRef.get().then(doc => {
      if (!doc.exists) {
        return "0";
      } else {
        const tileData = doc.data();
        return tileData.base64;
      }
    });
  }
};