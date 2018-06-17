import {filter} from 'rxjs/operators'

const ofType = (...types) => filter(({type}) => types.indexOf(type) > -1)

export default ofType
