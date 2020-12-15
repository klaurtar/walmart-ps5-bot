# walmart-ps5-bot

# Walmart PS5 Bot

## Introduction

I built this bot to go to Walmart.com and purchase one PS5 Bot for myself. I wanted to practice creating web bots, and I also wanted to purchase a PS5! This bot is not intended to purchase mass quantities of PS5's. I DO NOT SUPPORT SCALPERS.

Anyways, to use this bot I assume you already have a walmart.com account created, with you credit card and billing address saved to your profile. The bot makes it dead simple to grab a PS5 and check out (In most situations), by just logging you in to your account, sitting on the page and refreshing until the "Add to Cart" button becomes available, and then checking out with your account!

## What you need to do to run

To run this project you MUST create a .env file in the directory of the project that contains your Walmart email, Walmart Password, and the CCV of your credit card in this format:

```
//.env file content
WALMART_EMAIL=johnsmith@example.com

WALMART_PASSWORD=JohnSmith123

CREDIT_CARD_CVV=826
```

## Installation

1. Install Node.js version should be >12.9
2. Install git
3. download this project
4. Open up a terminal
5. navigate to the project directory cd `/the/project/directory`
6. Install all node dependencies using `npm i`
7. Create the `.env` file talked about above
8. npm start to run the bot

## Issues I am working on

1. Sometimes this bot will run into captcha issues based on the User Agent (stop the bot from running with `ctrl c` on mac and restart the script again with `npm start`)
2. I have not yet coded in logic for running into the "Oh Dear" page due to traffic spikes, or the "This was not added to cart modal"

## If you like my work, I am always looking for new opportunities! Hit me up!
