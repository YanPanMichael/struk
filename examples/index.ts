import _ from 'lodash';
function B() {
    console.log('test typescript')
    const name = _.assign({}, {name: 'test'})
}
function decorateArmour(num) {
    return function (target, key, descriptor) {
        const method = descriptor.value;
        let moreDef = num || 100;
        let ret;
        descriptor.value = (...args) => {
            args[0] += moreDef;
            ret = method.apply(target, args);
            return ret;
        }
        return descriptor;
    }
}


function addFunc(target) {
    target.prototype.addFunc = () => {
        return 'i am addFunc'
    }
    return target;
}

@addFunc 
class Man {
    constructor(def = 2, atk = 3, hp = 3) {
        this.init(def, atk, hp);
    }

    @decorateArmour(20)
    init(def, atk, hp) {
        this.def = def; // 防御值
        this.atk = atk;  // 攻击力
        this.hp = hp;  // 血量
    }
    toString() {
        return `防御力:${this.def},攻击力:${this.atk},血量:${this.hp}`;
    }
}

export const tony = new Man();
console.log(`当前状态 ===> ${tony}`);
// 输出：当前状态 ===> 防御力:102,攻击力:3,血量:3

export default B();