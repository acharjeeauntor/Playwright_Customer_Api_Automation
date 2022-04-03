import rimraf from "rimraf";

async function globalSetup(): Promise<void> {
    await new Promise(resolve => {
        rimraf(`./allure-results`, resolve);
        rimraf(`./html-report.zip`, resolve);
    });
}
export default globalSetup;