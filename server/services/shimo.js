const Shimo = require('shimo');
const shimo = new Shimo({ version: 'v2' });

class ShimoService {
  async getNavData () {
    const navData = await shimo.get(process.env.SHIMO_FILE_KEY);
    const data = JSON.parse(navData.content);
    const sheets = {};
    data.forEach(sheet => {
      const sheetMeta = this._pipeToObject(sheet[2]);
      let cells = sheet[1][0], cell, meta;
      for(let key in cells) {
        meta = this._pipeToObject(cells[key][2]);
        cell = null;
        if (cells[key][1][0] && cells[key][1][0][1]) {
          cell = cells[key][1][0][1];
        }

        if ('16' in meta) {
          cell = meta['16'];
        }

        if (!cell) {
          delete cells[key];
        } else {
          cells[key] = cell;
        }
      }
      cells = this._cellsToRowArray(cells);
      cells = this._rowArrayToObjects(cells);
      sheets[sheetMeta.name] = cells;
    });

    return sheets;
  }

  _pipeToObject (pipe) {
    const object = {};
    pipe.split('|').forEach(seg => {
      const splited = seg.split(':');
      object[splited[0]] = splited[1].replace(/^"|"$/g, '');
      if (!isNaN(object[splited[0]])) {
        object[splited[0]] = Number(object[splited[0]]);
      } else {
        object[splited[0]] = decodeURIComponent(object[splited[0]]);
      }
    });
    return object;
  }

  _cellsToRowArray (cells) {
    let array = [], rowLabel, colLabel, row, col;
    for (let label in cells) {
      colLabel = label.match(/[A-Z]+/)[0];
      rowLabel = label.match(/[0-9]+/)[0];
      // console.log(colLabel);
      col = colLabel.charCodeAt(0) - 65; //TODO 2 or more digit colLabel
      row = Number(rowLabel) - 1;
      if (!array[row]) {
        array[row] = [];
      }
      array[row][col] = cells[label];
    }
    return array;
  }

  _rowArrayToObjects (array) {
    const head = array[0];
    const body = array.slice(1);
    const objects = body.map(row => {
      const object = {};
      row.forEach((value, index) => {
        object[head[index]] = value;
      });
      return object;
    });
    return objects;
  }
}

module.exports = new ShimoService();
