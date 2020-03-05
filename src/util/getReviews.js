const puppeteer = require("puppeteer");
const scrollPageToBottom = require("puppeteer-autoscroll-down");

const schedule = require("node-schedule");

// Model
const Review = require("../model/Review");

// Web scrape for reviews off of FB
const scrapeReview = async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto(
    "https://www.facebook.com/pg/hughsdieselauto/reviews/?ref=page_internal",
    {
      timeout: 0,
      waitUntil: "load"
    }
  );

  const scrollStep = 250;
  const scrollDelay = 250;

  await scrollPageToBottom(page, scrollStep, scrollDelay);

  const reviews = await page.evaluate(() => {
    const results = Array.from(document.querySelectorAll("._1dwg")).map(
      item => {
        const review = item.querySelector("._5pbx p").textContent;

        const d = new Date();

        let datePosted = item.querySelector(".timestampContent").textContent;

        // Format date
        if (datePosted.includes("at")) {
          datePosted =
            datePosted.split("at")[0].trim() + ", " + d.getFullYear();
        }

        const name = item.querySelector("._5pb8").getAttribute("title");

        return { review, datePosted: new Date(datePosted).toISOString(), name };
      }
    );

    return results;
  });

  await browser.close();
  return reviews;
};

// Check for any new reviews on FB
// Auto runs every day
const getReview = () => {
  const checkForReviews = async () => {
    try {
      const reviewCount = await Review.find({}).countDocuments();

      const reviews = await scrapeReview();

      if (reviews.length > reviewCount) {
        // Update Review collection with recent reviews
        const sliceAmount = reviews.length - reviewCount;

        const reviewsToPush = reviews.slice(0, sliceAmount);

        for (let i = 0; i < reviewsToPush.length; i++) {
          const newReview = new Review({
            name: reviewsToPush[0].name,
            datePosted: reviewsToPush[0].datePosted,
            review: reviewsToPush[0].review
          });

          await newReview.save();
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  schedule.scheduleJob("0 23 * * *", () => {
    checkForReviews();
  });
};

module.exports = { getReview };
