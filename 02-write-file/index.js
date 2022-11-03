const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const currentPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(currentPath);

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
});

process.stdout.write('Привет, это второе задание\n');

function ask() {
    rl.question('Что бы вы хотели записать в текстовый файл?\n', (answer) => {
        if(answer === "exit") {
            rl.write('Пока, заходите еще, я буду скучать!');
            process.exit();
        }
        writeStream.write(answer.toString() + '\n');
        ask();
        rl.on('SIGINT', () => {
            process.stdout.write('Пока, заходите еще, я буду скучать!');
            process.exit();
        })
    })
}

ask();


