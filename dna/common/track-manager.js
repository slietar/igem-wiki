export default class TrackManager {
  constructor(options = {}) {
    this._circular = !!options._circular;
    this._margin = options.margin ?? 3;
    this._tracks = [];
  }

  add(pos, length, cx, labelWidth, textWidth, object) {
    if (typeof pos === 'object') {
      ({ pos, length, cx, labelWidth, textWidth, object } = pos);
    }

    let track = this._tracks.find((track) =>
      !track.some((entry) =>
        (pos >= entry.pos) && (pos < entry.pos + entry.length)
      || (pos + length > entry.pos) && (pos + length < entry.pos + entry.length)
      || (pos <= entry.pos) && (pos + length > entry.pos + entry.length)
      )
    );

    if (!track) {
      track = [];
      this._tracks.push(track);
    }

    track.push({
      index: track.length,
      pos,
      length,
      cx,
      labelWidth,
      object,
      textWidth: textWidth + this._margin * 2
    });
  }

  solve(factor = 1) {
    return this._tracks.map((track) => {
      let entries = new Set(track);
      let entriesLayers = track.map((entry) => ({ level: -1, object: entry.object }));

      for (let entry of entries) {
        let width = entry.textWidth;

        if (width < entry.labelWidth * factor) {
          entriesLayers[entry.index].level = 0;
          entries.delete(entry);
        }
      }

      let layerIndex = 1;

      while (entries.size > 0) {
        // let newEntries = new Set(entries);
        let entriesPlaced = new Set();

        for (let entry of entries) {
          let minX = entry.cx - entry.textWidth * 0.5;
          let maxX = entry.cx + entry.textWidth * 0.5;

          let ok = true;

          for (let other of entriesPlaced) {
            if (other === entry) {
              continue;
            }

            let ax = other.cx - other.textWidth * 0.5;
            let bx = other.cx + other.textWidth * 0.5;

            if ((ax > minX && ax < maxX) || (bx > minX && bx < maxX) || (ax > minX && bx < maxX)) {
              ok = false;
              break;
            }
          }

          for (let other of entries) {
            if (other === entry) {
              continue;
            }

            if (other.cx > minX && other.cx < maxX) {
              ok = false;
              break;
            }
          }

          if (ok) {
            entriesPlaced.add(entry);
            entriesLayers[entry.index].level = layerIndex;
            entries.delete(entry);
          }
        }

        if (entriesPlaced.size < 1) {
          break;
        }

        // entries = newEntries;
        layerIndex++;
      }

      return entriesLayers;
    });
  }
}
