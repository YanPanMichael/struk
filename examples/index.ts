import _ from 'lodash';
function B() {
    console.log('test typescript')
    const name = _.assign({}, {name: 'test'})
}

B();