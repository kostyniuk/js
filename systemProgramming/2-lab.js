'use strict';

const myMap = new Map();

const examples = [];
for (let i = 2; i < process.argv.length; i++) {
  examples.push(process.argv[i]);
}

myMap.set(1, {
  position: 1,
  dlm: () => myMap.get(2),
  cfr: () => myMap.get(2),
  ltr: () => myMap.get(2),
});

myMap.set(2, {
  position: 2,
  dlm: () => myMap.get(3),
  cfr: () => myMap.get(3),
  ltr: () => myMap.get(3),
});

myMap.set(3, {
  position: 3,
  dlm: () => myMap.get(7), // unusual
  cfr: () => myMap.get(4),
  ltr: () => myMap.get(4),
});

myMap.set(4, {
  position: 4,
  dlm: () => myMap.get(5),
  cfr: () => myMap.get(5),
  ltr: () => myMap.get(8), // unusual
});

myMap.set(5, {
  position: 5,
  dlm: () => myMap.get(6),
  cfr: () => myMap.get(5), // unusual
  ltr: () => myMap.get(6),
});

myMap.set(6, {
  position: 6,
  dlm: () => myMap.get(7),
  cfr: () => myMap.get(7),
  ltr: () => myMap.get(7),
});

myMap.set(7, {
  position: 7,
  dlm: () => myMap.get(8),
  cfr: () => myMap.get(8),
  ltr: () => myMap.get(8),
});

myMap.set(8, {
  position: 8,
  dlm: () => myMap.get(8),
  cfr: () => myMap.get(8),
  ltr: () => myMap.get(8),
});

const getSignals = (map) => {
  const signals = Object.keys(map.values().next().value);
  signals.shift();
  return signals;
};

const exec = (current, signals, allowedSignals, previous) => {
  const arrOfSgnls = signals;
  return () => {
    const signal = arrOfSgnls.shift();
    console.log(`${previous} -> ${current.position}`);
    if (!signal) return 'End';
    if (allowedSignals.includes(signal)) {
      return exec(current[signal](), arrOfSgnls, allowedSignals, signal)();
    }
    return exec(current, arrOfSgnls, allowedSignals, signal)();
  };
};

const simulation = (map, start, ...args) => {
  const first = map.get(start);
  const receivedSignals = args;
  const signals = getSignals(map);
  console.log(exec(first, receivedSignals, signals, 'start')());
};

simulation(myMap, 1, ...examples);
