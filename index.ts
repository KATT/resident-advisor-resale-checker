import * as request from 'request-promise-native';
import { prompt, ChoiceType } from 'inquirer';
import { notify } from 'node-notifier';
import * as cheerio from 'cheerio';

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

async function check(url: string, ids: string[], interval: number) {
  try {
    console.time('fetched page in');
    const body = await request(url);
    console.timeEnd('fetched page in');

    const $ = cheerio.load(body);
    for (const id of ids) {
      const isAvailable = $(`[id='${id}']`).hasClass('onsale');

      if (isAvailable) {
        notify({
          title: 'TICKETS AVAILABLE!',
          message: id,
        });
      }
    }
  } catch (err) {
    console.log(err);
    notify({
      title: 'ERROR',
      message: err.message,
    });
  }

  await wait(interval);

  check(url, ids, interval);
}

async function main() {
  const answers = await prompt(questions);
  const { interval, url } = answers as { [key: string]: string };

  const body = await request(url);

  const $ = cheerio.load(body);
  const $li = $('#tickets ul li');

  const choices: ChoiceType[] = [];
  $li.each((index, element) => {
    const $el = $(element);
    choices.push({
      value: $el.attr('id'),
      name: $el.text(),
    });
  });

  const { selected } = (await prompt([
    {
      type: 'checkbox',
      message: 'What tickets should we look out for?',
      name: 'selected',
      choices,
    },
  ])) as { selected: [string] };

  notify({
    title: 'Starting crawler...',
    message: `Watching: ${selected.join(', ')}`,
  });

  console.log(`Started crawling, will check site every ${interval} seconds.`);
  console.log(
    "You should see a notification now. If you don't, something is wrong 😿.",
  );
  await check(url, selected, parseInt(interval) * 1000);
}

main();
