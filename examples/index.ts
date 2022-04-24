import _ from 'lodash'

function B() {
  const name = _.assign({}, { name: 'test' })
  console.log('test typescript' + name)
}
function decorateArmour(num: number) {
  return function (target: any, descriptor: any) {
    const method = descriptor.value
    let moreDef = num || 100
    let ret
    descriptor.value = (...args: any) => {
      args[0] += moreDef
      ret = method.apply(target, args)
      return ret
    }
    return descriptor
  }
}

function addFunc(target: any) {
  target.prototype.addFunc = () => {
    return 'i am addFunc'
  }
  return target
}

@addFunc
class Man {
  def: number = 0
  atk: number = 0
  hp: number = 0
  constructor(def = 2, atk = 3, hp = 3) {
    this.init(def, atk, hp)
  }

  @decorateArmour(20)
  init(def: number, atk: number, hp: number) {
    this.def = def // 防御值
    this.atk = atk // 攻击力
    this.hp = hp // 血量
  }
  toString() {
    return `防御力:${this.def},攻击力:${this.atk},血量:${this.hp}`
  }
}

class C {
  a: string = 'ttt'
}

export const c = new C()

export const tony = new Man()
console.log(`当前状态 ===> ${tony}`)
// 输出：当前状态 ===> 防御力:102,攻击力:3,血量:3

export default B()
