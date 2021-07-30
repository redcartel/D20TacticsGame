import AnimationGroup from '../lib/AnimationGroup';
import {AnimationGroups, Sprites} from '../modules/assetLoaders';

export const characterPrefabs = {
    cleric:
        {
            defaultSprite: Sprites.cleric0,
            scale: 2,
            animations: {
                walk: AnimationGroups.clericWalkGroup,
                idle: AnimationGroups.clericWalkGroup
            },
            sheet: {
                HP: 8,
                walk: 6
            }
        },
    rogue:
        {
            defaultSprite: Sprites.rogueDRWalk1,
            scale: 2,
            animations: {
                walk: AnimationGroups.rogueWalkGroup,
                idle: AnimationGroups.rogueWalkGroup
            },
            sheet: {
                HP: 8,
                walk: 6
            }
        }
}