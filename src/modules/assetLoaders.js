import Sprite from '../lib/Sprite';
import VoxelTexture from '../lib/VoxelTexture';
import SoundClip from '../lib/SoundClip';
import Animation from '../lib/Animation';
import AnimationGroup from '../lib/AnimationGroup';
import VoxelDefinition from '../lib/VoxelDefinition';
import DecalTexture from '../lib/DecalTexture';

export const Sprites = {
    cleric0: new Sprite('game/sprites/cleric0', 'assets/Cleric.png', null, [22, 15, 18, 37]),
    cleric1: new Sprite('game/sprites/cleric1', 'assets/Cleric.png', null, [86, 15, 20, 37]),
    cleric2: new Sprite('game/sprites/cleric2', 'assets/Cleric.png', null, [213, 15, 18, 36]),
    cleric3: new Sprite('game/sprites/cleric3', 'assets/Cleric.png', null, [277, 15, 20, 36]),
    cleric4: new Sprite('game/sprites/cleric4', 'assets/Cleric.png', null, [150, 15, 18, 37]),
    rogueDRWalk1: new Sprite('game/sprites/rogue0', 'assets/Rog.png', null, [22,15,18,34]),
    rogueDRWalk2: new Sprite('game/sprites/rogue1', 'assets/Rog.png', null, [84,15,21,37]),
    rogueDRWalk3: new Sprite('game/sprites/rogue2', 'assets/Rog.png', null, [150,15,18,34]),
    rogueURWalk1: new Sprite('game/sprites/rogue3', 'assets/Rog.png', null, [213,16,21,35]),
    rogueURWalk2: new Sprite('game/sprites/rogue4', 'assets/Rog.png', null, [278,16,19,35]),
    rogueURWalk3: new Sprite('game/sprites/rogue5', 'assets/Rog.png', null, [314,16,23,35])
};

export const VoxelTextures = {
    grass: new VoxelTexture('game/textures/grass', 'assets/Grass.png'),
    dirt: new VoxelTexture('game/textures/dirt', 'assets/Brown Stony.png'),
    stone: new VoxelTexture('game/textures/stone', 'assets/Grey Stones.png'),
    water: new VoxelTexture('game/textures/water', 'assets/Water Deep Blue.png'),

};

export const DecalTextures = {
    pentagram: new DecalTexture('game/textures/pentagram', 'assets/Penta.png')
}

export const Sounds = {
    necrophage: new SoundClip('game/sounds/necrophage', 'assets/Necrophage.wav')
};

export const Animations = {
    clericWalkDR: new Animation('game/animations/clericWalkDR', [
        { sprite: Sprites.cleric0, ticks: 25 },
        { sprite: Sprites.cleric1, ticks: 50 }]),

    clericWalkDL: new Animation('game/animations/clericWalkDL', [
        { sprite: Sprites.cleric0, ticks: 25, flip: true },
        { sprite: Sprites.cleric1, ticks: 50, flip: true }
    ]),

    clericWalkUR: new Animation('game/animations/clericWalkUR', [
        { sprite: Sprites.cleric2, ticks: 25 },
        { sprite: Sprites.cleric3, ticks: 50 }
    ]),

    clericWalkUL: new Animation('game/animations/clericWalkUL', [
        { sprite: Sprites.cleric2, ticks: 25, flip: true },
        { sprite: Sprites.cleric3, ticks: 50, flip: true }
    ]),

    rogueWalkDR: new Animation('game/animations/rogueWalkDR', [
        { sprite: Sprites.rogueDRWalk1, ticks: 15},
        { sprite: Sprites.rogueDRWalk2, ticks: 30},
        { sprite: Sprites.rogueDRWalk3, ticks: 45}
    ]),

    rogueWalkDL: new Animation('game/animations/rogueWalkDR', [
        { sprite: Sprites.rogueDRWalk1, ticks: 15, flip: true},
        { sprite: Sprites.rogueDRWalk2, ticks: 30, flip: true},
        { sprite: Sprites.rogueDRWalk3, ticks: 45, flip: true}
    ]),

    rogueWalkUR: new Animation('game/animations/rogueWalkUR', [
        { sprite: Sprites.rogueURWalk1, ticks: 15},
        { sprite: Sprites.rogueURWalk2, ticks: 30},
        { sprite: Sprites.rogueURWalk3, ticks: 45}
    ]),

    rogueWalkUL: new Animation('game/animations/rogueWalkUR', [
        { sprite: Sprites.rogueURWalk1, ticks: 15, flip: true},
        { sprite: Sprites.rogueURWalk2, ticks: 30, flip: true},
        { sprite: Sprites.rogueURWalk3, ticks: 45, flip: true}
    ]),
}

export const AnimationGroups = {
    clericWalkGroup: new AnimationGroup('game/animationGroups/clericWalkGroup', [
        Animations.clericWalkUL,
        Animations.clericWalkUR,
        Animations.clericWalkDR,
        Animations.clericWalkDL
    ]),

    rogueWalkGroup: new AnimationGroup('game/animationGroups/rogueWalkGroup', [
        Animations.rogueWalkUL,
        Animations.rogueWalkUR,
        Animations.rogueWalkDR,
        Animations.rogueWalkDL
    ])
}

export const VoxelDefinitions = {
    grassDirt: new VoxelDefinition('game/voxelDefinitions/grassDirt', [VoxelTextures.grass, VoxelTextures.dirt]),
    stone: new VoxelDefinition('game/voxelDefinitions/stone', [VoxelTextures.stone]),
    water: new VoxelDefinition('game/voxelDefinitions/water', [VoxelTextures.water]),
    dirt: new VoxelDefinition('game/voxelDefinitions/dirt', [VoxelTextures.dirt])
}