import A from './moduleA';
import data from './data.ls';

console.log('in enty js');
A.log();

console.log('fetched data in custom loader:');
console.log(`data.a == ${data.a}`);