const puppeteer = require( 'puppeteer' ) ;
const fs = require( 'fs');
const config = require('./config.json');
const cookies = require( './cookies.json' ) ;

(async ( ) => {
	/*Start up puppeteer and create a new page*/
	/*let browser = await puppeteer.launch({ headless: false });*/
	let browser = await puppeteer.launch({ headless: false });
	let page = await browser.newPage();


	/*Check if we have a previously saved session*/
	if (Object.keys(cookies).length) {
		
		/*Set the saved cookies in the puppeteer browser page*/
		await page.setCookie(...cookies);

		/*GO to starlink*/
		await page.goto('https://auth.starlink.com', { waitUntil: 'networkidle2' });

	} else {
		/*Go to the starlink login page*/
		await page.goto( 'https://auth.starlink.com', { waitUntil: 'networkidle0' });

		/*Write in the username and password*/
		await page.type( '#mat-input-0', config.username, { delay: 30 });
		await page.type( '#mat-input-1' , config.password, { delay: 30 });

		/*Click the login button*/
		await page.click( 'button.button-filled');

		/*Write console coment*/
		console.log('Press button!')

		 /*Wait for navigation to finish*/
		 await page.waitForNavigation({ waitUntil: 'networkidle0' });
		 await page.waitFor(15000);
	 
		 /*Check if logged in*/
		 try {
		   await page.waitFor( 'marketing-client-container');
		 }
		 catch(error) {
		   console. tog( 'Failed to login.' );
		   process.exit(0);
		 }

		/*Get the current browser page session*/
		let currentCookies = await page.cookies();

		/*Create a cookie file (if not already created) to hold the session*/
		fs.writeFileSync( './cookies.json', JSON.stringify( currentCookies ));
	}
	debugger;
})();