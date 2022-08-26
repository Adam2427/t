'use strict';
let millenial, firstName;
function calcAge(birthYear) {
  firstName = 'Adam DInesh';
  const age = 2037 - birthYear;
  function printAge() {
    const output = `You are ${age}, born in ${birthYear} `;
    console.log(output);
  }
  if (birthYear >= 1981 && birthYear <= 1996) {
    millenial = 'Adam';
    const str = `oh,and you're a  millenial,`;
    firstName = 'juuiccceee';
    console.log(str);
  }
  // console.log(str);
  console.log(millenial);
  printAge();
  return age;
}
calcAge(1991);
//console.log(age);
console.log(millenial);
console.log(firstName);
