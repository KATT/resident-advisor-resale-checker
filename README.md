# Resident Advisor Ticket Resale Checker

## How to use:

```
npm i
npm start
```

## Wut

Will prompt you on:

* which URL to check
* how often to check it (don't DDoS RA, please.)
* which type of tickets to look out for

... and theeen 🎉

* Notifies whenever any of the selected ticket type gets `onsale`
* Will run forever until you exit it.

### Example

```
? URL to check: https://www.residentadvisor.net/events/1072201
? Check interval (seconds) 20
? What tickets should we look out for?
 ◯ £13.00Entry before 12AM
 ◉ £10.00Early bird (priority entry before 1AM)
 ◉ £19.001st release (priority entry before 1AM)
 ◉ £23.002nd release (priority entry before 1AM)
 ◉ £29.00Ticket + CD fabric 02: Terry Francis
 ◉ £29.00Ticket + CD fabric 87: Alan Fitzpatrick
❯◉ £29.00Ticket + CD fabric 98: Maceo Plex
```
