import A from './moduleA';
import data from './data.ls';
import log from './log.js';
log('in enty js');
A.log();

log('fetched data in custom loader:');
log(`data.a == ${data.a}`);