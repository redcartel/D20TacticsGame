export default class AnimationGroup {
    constructor(name, animations = null) {
        this.name = name;
        var details = _i.getAnimationGroupDetails(name);
        if (details != null && details.length > 0) return;
        try {
            _i.createAnimationGroup(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.createAnimationGroup with ${this.name}`);
            console.error(e);
        }
        if (animations != null) {
            var animationNames = animations.map(animation => animation.name);
            try {
                _i.setGroupAnimations(this.name, animationNames);
            }
            catch (e) {
                console.error(`Error calling _i.setGroupAnimations with ${this.name} ${JSON.stringify(animations)}`);
                console.error(e);
            }
        }
    }

    setAnimations(animations) {
        var animationNames = animations.map(animation => animation.name);
        try {
            _i.setGroupAnimations(this.name, animationNames);
        }
        catch (e) {
            console.error(`Error calling _i.setGroupAnimations with ${this.name} ${JSON.stringify(animations)}`);
            console.error(e);
        }
    }
}

window.AnimationGroup = AnimationGroup;