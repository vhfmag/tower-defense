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
  board.set('imageUrl', '/images/path-12.jpg');

  const pathObjects = [
    PathCoords.create({ x: -3, y: 10 }),
    PathCoords.create({ x: 15, y: 10 }),
    PathCoords.create({ x: 15, y: 25 }),
    PathCoords.create({ x: 5, y: 25 }),
    PathCoords.create({ x: 5, y: 60 }),
    PathCoords.create({ x: 40, y: 60 }),
    PathCoords.create({ x: 40, y: 42 }),
    PathCoords.create({ x: 60, y: 42 }),
    PathCoords.create({ x: 60, y: 60 }),
    PathCoords.create({ x: 95, y: 60 }),
    PathCoords.create({ x: 95, y: 75 }),
    PathCoords.create({ x: 85, y: 75 }),
    PathCoords.create({ x: 85, y: 90 }),
    PathCoords.create({ x: 103, y: 90 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 20;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 1475,
      health: 300,
      maxHealth: 300,
      points: 5,
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
  const towerGroup1 = getNewTowerGroup(14, 15);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [
    { type: 2 }, { type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }
  ]);
  determineFlexDirectionEligibility(towerGroup1);

  wave.set('towerGroups', Ember.A([towerGroup1]));
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

export default function createWave12() {
  const wave = Wave.create({
    towerStylesHidden: false,
    instructions: {
      main: `Essa última é bem difícil! Use as propriedades que você aprendeu pra pontuar 80 ou mais!

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

**align-items** and **align-self**
* \`flex-start\`: alinha item(s) ao começo do eixo secundário do container
* \`flex-end\`: alinha item(s) ao final do eixo secundário do container
* \`center\`: alinha item(s) ao centro do eixo secundário do container

**flex-direction**
* \`row\`: dispõe o eixo principal da esquerda pra direita
* \`row-reverse\`: dispõe o eixo principal da direita pra esquerda
* \`column\`: dispõe o eixo principal de cima pra baixo
* \`column-reverse\`: dispõe o eixo principal de baixo pra cima

**order**
* \`número\`: posiciona um item com relação a outros itens no container`,
      tldr: `Use as propriedades que aprendeu para posicionar suas torres:
             <nobr class="text__code">justify-content ▾</nobr>, <nobr
             eita class="text__code">align-items ▾</nobr>, <nobr
             class="text__code">flex-direction ▾</nobr>, <nobr
             class="text__code">order ▾</nobr>, <nobr
             class="text__code">align-self ▾</nobr>.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
