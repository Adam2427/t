'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDate: [],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDate: [],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDate: [],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDate: [],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; //.txtcontent=0
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const formattedMov = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(mov);
    let displayDate = new Date().toLocaleDateString();
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//displayMovements(account1.movements);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.innerHTML = `${acc.balance.toFixed(2)} €`;
};

//calcDisplayBalance(account1.movements);
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((a, b) => a + b, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = movements.filter(mov => mov < 0).reduce((a, b) => a + b, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((a, b) => a + b, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
//calcDisplaySummary(account1.movements);
//update ui
const updateUi = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
////SETT countdown
let timer;
const startLogoutTimer = function () {
  let time = 120;

  const setTime = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); //100%60=40
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time === 0) {
      clearInterval(setTime);
      labelWelcome.textContent = 'Log in to get started... ';
      containerApp.style.opacity = 0;
    }
  };
  setTime();
  timer = setInterval(setTime, 1000);
  return timer;
};

//////Fake Loggin a;ways open
let currentAccount;
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;
labelDate.textContent = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

///////////////
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // displayMovements(currentAccount.movements);
    // calcDisplayBalance(currentAccount);
    // calcDisplaySummary(currentAccount);
    updateUi(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receivedAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receivedAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receivedAcc.movements.push(amount);
    currentAccount.movementsDate.push(new Date().toLocaleDateString());
    receivedAcc.movementsDate.push(new Date().toLocaleDateString());
    updateUi(currentAccount); //updateUi
    inputTransferAmount.value = inputTransferTo.value = '';
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDate.push(new Date().toLocaleDateString());

      updateUi(currentAccount);
    }, 2500);
  }
  clearInterval(timer);
  timer = startLogoutTimer();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // const closerAcc =
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const closerAcc = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    accounts.splice(closerAcc, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = 'Log in to get started... ';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
// const arr = [33, 33, 44, 55, 77];
// console.log(arr.at(-1));
// console.log(arr.slice(-1));
// console.log(arr.at(-1));
// var str = 'Hallo';
// console.log(str.at(-1));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const [i, movement] of movements.entries()) {
//   movement > 0
//     ? console.log(`Movement ${i + 1}: you deposited ${movement}`)
//     : console.log(`Movement ${i + 1}: you withdraw ${Math.abs(movement)}`);
//` ${movement>0}`
//   console.log(
//     `you ${movement > 0 ? 'deposited' : 'withdraw'} ${Math.abs(movement)}`
//   );
// }
// console.log('----forEach----');
// movements.forEach((movement, i) => {
//   movement > 0
//     ? console.log(`Movement ${i + 1}: you deposited ${movement}`)
//     : console.log(`Movement ${i + 1}: you withdraw ${Math.abs(movement)}`);
// });

/////ex 148
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   //console.log(dogsJuliaCorrected);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);
//   dogs.forEach((dog, ind) => {
//     if (dog >= 3) {
//       console.log(`dog number :${ind + 1} it is a Dog`);
//     } else {
//       console.log(`dog number :${ind + 1} it is a puppy`);
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => (mov > 0 ? mov : 100));
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDFor = [];
// for (const mov of movements) {
//   movementsUSDFor.push(mov * eurToUsd);
// }
// console.log(movementsUSDFor);

// const movementsDes = movements.map((mov, i) => {
//   return `Movement ${i + 1}: YOu ${mov > 0 ? 'deposit' : 'withdrew'} ${Math.abs(
//     mov
//   )}`;
// });
// console.log(movementsDes);

//const user = 'Steven Thomas Williams';
createUsernames(accounts);
// console.log(accounts);
// const withderwA = [];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);
// const depositsArr = [];
// const withderwArr = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsArr.push(mov);
//   } else {
//     withderwArr.push(Math.abs(mov));
//   }
// }
// console.log(depositsArr);
// console.log(withderwArr);

// console.log(movements);
// const balance = movements.reduce(function (acc, val, i) {
//   console.log(`iteration ${i}: ${acc} `);
//   return acc + val;
// }, 0);
// console.log(balance);
// console.log('----ForEach----');
// let c = 0;
// for (let [a, b] of movements.entries()) {
//   // console.log(a, b);
//   c += b;
// }
// //console.log(a, c);
// console.log(c);
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   // else return mov;
// }, movements[0]);
// console.log(max);

// const calAverageHumanAge = age => {
//   return age
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((a, b, i, arr) => a + b / arr.length, 0);
// };

// console.log(calAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);
// const anyDeposit = movements.some(mov => mov >= 1500);
// console.log(anyDeposit);
// console.log(account2.movements.every(acc => acc >= 0));
// const deposits = mov => mov >= 0;
// console.log(movements.some(deposits));
// console.log(movements.every(deposits));
// console.log(movements.filter(deposits));
// console.log(movements.find(deposits));
// const arr1 = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr1.flat());
// const arr2 = [[[1, 2, [2]], 3], [4, [5, 6]], 7, 8];
// console.log(arr2.flat(3));
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const alMovements = accountMovements.flat();
// console.log(alMovements);
// const overalBalance = alMovements.reduce((a, b) => a + b, 0);
// console.log(overalBalance);

// const overalBalance1 = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((a, b) => a + b, 0);
// console.log(overalBalance1);

// const owners = ['jonas', 'Zach', 'Adam', 'Martha'];
// const own1 = [...owners].sort();
// console.log(owners);
// console.log(own1);
// console.log(movements.sort());
// console.log(movements.sort((a, b) => a - b));

// const x = new Array(5);
// x.fill(2, 1, 4);
// console.log(...x);
// const y = Array.from({ length: 7 }, () => 2);
// console.log(y);
// const z = Array.from({ length: 5 }, (_, i) => i + 1);
// console.log(z);
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
// });
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((a, b) => a + b, 0);
// console.log(bankDepositSum);
// const bankDepositSum1 = accounts
//   .flatMap(acc => acc.movements)
//   // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(bankDepositSum1);
// let s = 10;
// console.log(++s);
// const { deposit, withdraw } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       cur > 0 ? (sum.deposit += cur) : (sum.withdraw += cur);
//       return sum;
//     },
//     { deposit: 0, withdraw: 0 }
//   );
// console.log(deposit, withdraw);

// const { deposit, withdraw } = accounts.flatMap(acc => acc.movements);
// // .reduce(
//   (sum, cur) => {
//     // cur > 0 ? (sum.deposit += cur) : (sum.withdraw += cur);
//     // return sum;
//     sum[cur > 0 ? 'deposit' : 'withdraw'] += cur;
//     return sum;
//   },

// { deposit: 0, withdraw: 0 }
// );
// console.log(deposit, withdraw);
// let arr = ['this', 'is', 'a', 'nice', 'title'];
// const convertTitleCase = function (title) {
//   let capitiliseWord = str => str[0].toUpperCase() + str.slice(1);
//   const expections = ['an', 'is', 'a', 'the', 'but', 'on', 'or', 'in', 'with'];
//   const convertTittle = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (expections.includes(word) ? word : capitiliseWord(word)))
//     .join(' ');
//   return convertTittle;
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('and this is a nice title'));
//////ex167

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.7 * 28)));
// console.log(dogs);
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }`
// );
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// // const ownerEatTOOLitlle
// console.log(`${ownersEatTooMuch.join(' and ')} dogs are Eat Too Much`);

// console.log(dogs.some(dog => dog.curFood === dog.recFood));
// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
// console.log(dogs.some(checkEatingOkay));
// console.log(dogs.filter(checkEatingOkay));

// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSorted);

// console.log(23 === 23.0);
// console.log(0.1 + 0.2 === 0.3);
// //base 0-9 1/10=0.1.3/10=3.333
// //binary base 0 1
// console.log(0.1 + 0.2);
// //conversion
// console.log(typeof '23');
// console.log(typeof '23' + '23');
// console.log(typeof Number('23'));
// //parsing
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('px30'));
// console.log(Number.parseInt('p30x'));
// console.log(Number.parseFloat('3.03px'));
// console.log('-----is finite----');
// //console.log(Number.isNaN(+'x2'));
// console.log(Number.isFinite(23));
// console.log(Number.isFinite('23'));
// console.log(Number.isFinite(+'23'));
// console.log(Number.isFinite(+'23e'));
// console.log(Number.isFinite(23 / 0));
// console.log('-----is interger----');
// console.log(Number.isInteger(23));
// console.log(Number.isInteger('23'));
// console.log(Number.isInteger(+'23'));
// console.log(Number.isInteger(+'23e'));
// console.log(Number.isInteger(23 / 0));
// console.log('---Math----');
// console.log(Math.sqrt(25));
// console.log(Math.sqrt(25, 0));
// console.log(25 ** (1 / 2));
// console.log(25 ** 2);
// console.log(8 ** (1 / 3));
// console.log(8 ** 3);
// console.log(Math.max(23, 23, 2, 3, 5, 0, 3));
// console.log(Math.max(23, 23, 2, 3, 5, 0, '33'));
// console.log(Math.max(23, 23, 2, 3, 5, 0, '44s'));
// console.log(Math.min(23, 23, 2, 3, 5, 0, 33));
// console.log(Math.PI / (22 / 7));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// //console.log(Math.trunc(Math.random() * 100) + 1);
// const randomInt = (min, max) => Math.trunc(Math.random() * (max - min)) + min;
// console.log(randomInt(10, 20));
// console.log(+(2.6).toFixed(0));

// console.log(5 % 2); //remainder
// console.log(5 / 2); //divider
// console.log(6 % 2);
// console.log(8 / 2);
// console.log(8 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));
// addEventListener('')
// labelBalance.addEventListener('mouseover', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'blue';
//     if (i % 3 === 0) row.style.backgroundColor = 'orange';
//   });
// });
// console.log('_');
// const dia = 345_55;
// console.log(dia);

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(BigInt(33333939393939939390000020202094984828028208));

// const huge = 333339393939399393900000202020333339393939399393900000202020;
// const num = 333;

// console.log(BigInt(huge) * BigInt(num));
// console.log(20n > 2);
// console.log(20n === 20);
// console.log(20n == '20');
// console.log(typeof 20n);
// console.log(12n / 3n);

//create a date
// const date = new Date();
// console.log(date);
// console.log(new Date('Mar 09 2022 3:24'));
// console.log(new Date('March 08,2000 '));
// console.log(new Date(3 * 24 * 60 * 60 * 1000).getDate());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).getDay());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).getFullYear());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).getMonth());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).getTime());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).toDateString());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).toISOString());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).toLocaleDateString());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).toLocaleTimeString());
// console.log(new Date(3 * 24 * 60 * 60 * 1000).toUTCString());
// const future = new Date(2037, 10, 18);
// console.log(future);
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 10, 7), new Date(2037, 10, 1));
// console.log(days1);
// if (days1 === 0) {
//   console.log('today');
// } else if (days1 === 1) {
//   console.log('yesterday');
// } else if (days1 <= 7) {
//   console.log(`${days1} days ago`);
// }
// const op = {
//   hour: 'numeric',
// };
// console.log(op);

////// international Date format
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(
//   new Date()
// );
// const num = 32222345.23;
// const options1 = {
//   style: 'unit',
//   unit: 'mile-per-hour',
// };

// console.log(new Intl.NumberFormat('en-US', options1).format(num));
// console.log(new Intl.NumberFormat('de-DE', options1).format(num));
// console.log(new Intl.NumberFormat(navigator.language, options1).format(num))

// console.log('let three seconds to start the function');
// const ingredients = ['olives', 'spinash'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`here is your pizza with ${ing1} and  ${ing2}`),
//   3000,
//   ...ingredients
// );
// if (ingredients.includes('olives')) clearTimeout(pizzaTimer);

// const st = setInterval(function () {
//   const date = new Date().toLocaleTimeString();
//   console.log(date);
// }, 1000);

// clearInterval(st);
