import AnimationGroup from '../lib/AnimationGroup';
import {AnimationGroups, Sprites} from '../modules/assetLoaders';

export const characterPrefabs = {
    cleric:
        {
            defaultSprite: Sprites.cleric0,
            scale: 2,
            animations: {
                walk: AnimationGroups.clericWalkGroup,
                idle: AnimationGroups.clericWalkGroup,
                die: AnimationGroups.rogueDieGroup
            },
            sheet: {
                HP: 8,
                walk: 6.5,
                dex: 12,
            }
        },
    rogue:
        {
            defaultSprite: Sprites.rogueDRWalk1,
            scale: 2,
            animations: {
                walk: AnimationGroups.rogueWalkGroup,
                idle: AnimationGroups.rogueWalkGroup,
                die: AnimationGroups.rogueDieGroup
            },
            sheet: {
                HP: 8,
                walk: 6.5,
                dex: 16,
            }
        },
    deadRogue: 
        {
            defaultSprite: Sprites.rogueDRKneel,
            scale: 2,
            animations: {
                idle: AnimationGroups.rogueDieGroup
            }
        }
}