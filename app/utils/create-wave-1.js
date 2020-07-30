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
  board.set('imageUrl', '/images/path-1.jpg');

  const pathObjects = [
    PathCoords.create({ x: 60, y: -3 }),
    PathCoords.create({ x: 60, y: 40 }),
    PathCoords.create({ x: 35, y: 40 }),
    PathCoords.create({ x: 35, y: 60 }),
    PathCoords.create({ x: 60, y: 60 }),
    PathCoords.create({ x: 60, y: 103 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 5;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 2000,
      health: 200,
      maxHealth: 200,
      points: 20,
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
  const towerGroup1 = getNewTowerGroup(1, 47);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 1 }]);
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

export default function createWave1() {
  const wave = Wave.create({
    towerStylesHidden: true,
    instructions: {
      main: `Sua missão é impedir inimigos de passarem de suas defesas. Diferente
             de outros jogos de <i lang="en">tower defense</i>, você deve posicionar
             suas torres usando CSS!

Você vai começar com propriedades de container. Um container flex tem um eixo
principal (<i lang="en">main axis</i>) e um eixo secundário (<i lang="en">cross axis</i>).

<img src="images/flexbox-row.png" class="instructions__diagram" alt="flexbox diagram">

Use a propriedade \`justify-content\` no container tower-group-1 para mover suas
torres para posições efetivas. \`justify-content\` posiciona os itens de um container
ao longo de seu eixo principal e aceita os seguintes valores:

* \`flex-start\`: agrupa itens no começo do eixo principal do container
* \`flex-end\`: agrupa itens no final do eixo principal do container
* \`center\`: agrupa items no centro do eixo principal do container
* \`space-between\`: distribui os itens igualmente ao longo do eixo principal
de forma que o primeiro item alinha com o começo e o último, com o fim
* \`space-around\`: distribui os itens igualmente ao longo do eixo principal
de forma que todos os itens tenham o mesmo espaço ao seu redor
* \`space-evenly\`: distribui os itens igualmente ao longo do eixo principal
de forma que todos os espaços sejam iguais

Tente \`justify-content: center\`, por exemplo, para mover as torres do container
para o centro do eixo principal.`,
      tldr: `Use a propriedade <nobr class="text__code">justify-content ▾</nobr>
             para mover essas duas torres para a posição correta. Clique no botão <i
             class="fa fa-question-circle"></i> na folha de estilo (CSS) para ver
             novamente como a propriedade funciona.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
