import {log as logB} from './moduleB';

export default {
	log() {
		console.log('ModuleA log()');
		logB();
	}
}
