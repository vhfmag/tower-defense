import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/path-10.jpg');

  const pathObjects = [
    PathCoords.create({ x: 10, y: -3 }),
    PathCoords.create({ x: 10, y: 30 }),
    PathCoords.create({ x: 90, y: 30 }),
    PathCoords.create({ x: 90, y: 10 }),
    PathCoords.create({ x: 70, y: 10 }),
    PathCoords.create({ x: 70, y: 50 }),
    PathCoords.create({ x: 30, y: 50 }),
    PathCoords.create({ x: 30, y: 90 }),
    PathCoords.create({ x: 10, y: 90 }),
    PathCoords.create({ x: 10, y: 70 }),
    PathCoords.create({ x: 90, y: 70 }),
    PathCoords.create({ x: 90, y: 103 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 25;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 700,
      health: 300,
      maxHealth: 300,
      points: 4,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      groupNum,
      numRows,
      posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  // getNewTowerGroup = function(numRows, posY)
  const towerGroup1 = getNewTowerGroup(1, 17);
  const towerGroup2 = getNewTowerGroup(1, 77);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 2 }, { type: 1 }]);
  addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 2 }, { type: 1 }]);
  determineFlexDirectionEligibility(towerGroup1);
  determineFlexDirectionEligibility(towerGroup2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2]));
}

function addTowersToTowerGroup(towerGroup, specsForTowers) {
  function getNewTower(towerNum, type) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = [];
  for (var i = 1; i < specsForTowers.length + 1; i++) {
    newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
  }

  towerGroup.set('towers', newTowers);
}

function determineFlexDirectionEligibility(towerGroup) {
  const numTowers = towerGroup.get('towers.length');
  const numRows = towerGroup.get('numRows');

  if (numRows >= numTowers) {
    towerGroup.set('flexDirectionAllowed', true);
  }
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave10() {
  const wave = Wave.create({
    towerStylesHidden: false,
    instructions: {
      main: `As super torres estão mal posicionadas de novo, mas dessa vez você
             vai precisar estilizar as torres em si ao invés dos grupos.

A propriedade \`order\` defina a orgem em que itens aparecem no container flex
e aceita números inteiros positivos ou negativos. Todos os itens flex começam
com uma ordem padrão de 0, então um item com uma ordem maior do que 0 vai
ser reposicionado para depois de itens que tenham o valor padrão.

Use \`justify-content\` e \`order\` para posicionar suas torres.

**justify-content**
* \`flex-start\`: agrupa itens no começo do eixo principal do container
* \`flex-end\`: agrupa itens no final do eixo principal do container
* \`center\`: agrupa items no centro do eixo principal do container
* \`space-between\`: distribui os itens igualmente ao longo do eixo principal
de forma que o primeiro item alinha com o começo e o último, com o fim
* \`space-around\`: distribui os itens igualmente ao longo do eixo principal
de forma que todos os itens tenham o mesmo espaço ao seu redor
* \`space-evenly\`: distribui os itens igualmente ao longo do eixo principal
de forma que todos os espaços sejam iguais

**order**
* \`número\`: posiciona um item com relação a outros itens no container`,
    tldr: `Posicione suas torres combinando a propriedade de container
           <nobr class="text__code">justify-content ▾</nobr> com a propriedade
           de item <nobr class="text__code">order ▾</nobr>. Lembre-se que todos
           os itens tem uma ordem padrão de 0.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
