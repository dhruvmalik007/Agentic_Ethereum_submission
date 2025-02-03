import {StagehandConfig} from "./stagehand.config.js"
import { Stagehand } from "@browserbasehq/stagehand";
import chalk from "chalk";
import boxen from "boxen";

// config();

// class AutonomeOnlineWorkflow {
//   private browser: Browser | null = null;
//   private page: Page | null = null;
//   startingURL: string = "https://dev.autonome.fun/autonome"
//   async connectToBrowser() {
//     this.browser = await chromium.connectOverCDP(
//       `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}`
//     );
//   }

//   async getDefaultContext() {
//     if (!this.browser) throw new Error("Browser not connected");
//     const defaultContext = this.browser.contexts()[0];
//     this.page = defaultContext.pages()[0];
//   }

//   async navigateToURL(url: string) {
//     if (!this.page) throw new Error("Page not initialized");
//     await this.page.goto(url);
//   }

//   async closePage() {
//     if (this.page) {
//       await this.page.close();
//     }
//   }

//   async closeBrowser() {
//     if (this.browser) {
//       await this.browser.close();
//     }
//   }

//   async executeWorkflow() {
//     try {
//       await this.connectToBrowser();
//       await this.getDefaultContext();
//       await this.navigateToURL("https://browserbase.com/");
//       await this.closePage();
//       await this.closeBrowser();
//     } catch (error) {
//       console.error(error.message);
//     }
//   }
// }

// const workflow = new AutonomeOnlineWorkflow();
// workflow.executeWorkflow();

class BrowserAutomation {
  private stagehand: Stagehand;

  constructor(private steps: string[]) {
    this.stagehand = new Stagehand({
      ...StagehandConfig,
    });
  }

  async execute() {
    await this.stagehand.init();
    const page = this.stagehand.page;

    if (StagehandConfig.env === "BROWSERBASE") {
      console.log(
        boxen(
          `View this session live in your browser: \n${chalk.blue(
            `https://browserbase.com/sessions/${this.stagehand.browserbaseSessionID}`
          )}`,
          {
            title: "Browserbase",
            padding: 1,
          }
        )
      );
    }

    for (const step of this.steps) {
      await page.act({ action: step });
    }

    await this.stagehand.close();

    if (StagehandConfig.env === "BROWSERBASE") {
      console.log(
        "Session completed. Waiting for 10 seconds to see the logs and recording..."
      );
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log(
        boxen(
          `View this session recording in your browser: \n${chalk.blue(
            `https://browserbase.com/sessions/${this.stagehand.browserbaseSessionID}`
          )}`,
          {
            title: "Browserbase",
            padding: 1,
            margin: 3,
          }
        )
      );
    } else {
      console.log(
        "We hope you enjoyed using Stagehand locally! On Browserbase, you can bypass captchas, replay sessions, and access unparalleled debugging tools!\n10 free sessions: https://www.browserbase.com/sign-up\n\n"
      );
    }

    console.log(
      `🤘 Thanks for using Stagehand! Create an issue if you have any feedback: ${chalk.blue(
        "https://github.com/browserbase/stagehand/issues/new"
      )}\n`
    );
  }
}


// Example usage.
// const steps = [
//   "click on the `Sign it with google` format.",
//   "Approve the permissions",
//   "Select the `Eliza` framework option.",
// ];

// const automation = new BrowserAutomation(steps);
// automation.execute().catch(console.error);