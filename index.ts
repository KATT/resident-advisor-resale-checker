import * as request from 'request-promise-native';
import { prompt } from 'inquirer';
import { notify } from 'node-notifier';

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'URL to check:',
    default: () => 'https://www.residentadvisor.net/events/1072201',
  },
  {
    type: 'input',
    name: 'interval',
    message: 'Check interval (seconds)',
    default: () => 20,
    validate: val => !isNaN(parseInt(val)),
  },
];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function check(url: string, interval: number, isFirst: boolean = false) {
  try {
    console.time('loading');
    const body = await request(url);
    console.timeEnd('loading');

    if (body.includes('buynow')) {
      notify({
        title: 'TICKETS AVAILABLE!',
        message: 'Tickets available!!',
      });
      console.log(`Tickets available! GO GO GO 👉  ${url}`);
    }
    console.log('Neup.');
  } catch (err) {
    console.log(err);
    notify({
      title: 'ERROR',
      message: err.message,
    });
  }

  setTimeout(() => {
    check(url, interval);
  }, interval);
}

async function main() {
  const answers = await prompt(questions);
  const { interval, url } = answers as { [key: string]: string };

  notify({
    title: 'Starting crawler...',
    message: JSON.stringify(answers),
  });

  await check(url, parseInt(interval) * 1000, true);
}

main();
