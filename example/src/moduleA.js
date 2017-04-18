import {log as logB} from './moduleB';
import log from './log.js';
export default {
	log() {
		log('ModuleA log()');
		logB();
	}
}
