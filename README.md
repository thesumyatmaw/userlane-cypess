# userlane-cypess
## How to run the Cypress Test
* Download the Zip file or clone
* please go inside the automate testing folder from Terminal
* Run `npm install`
* After that run `npx cypress open`
* Cypress browser will open automatically.

There has two files under the **Integration Tests**  which are **jobsearch.features.js** and **applyqajob.feature.js** files.

#### In the jobsearch.feature.js file, I wrote three test cases _
1.  Check Career page and click on Open position button 
    * I checked the brand logo, img files, some elements and did the assertion in the careepage.
2.  Displays job teams and positions list
    * When I checked the userlane career page in the network tab, I saw this url: https://api.lever.co/v0/postings/userlane?group=team&mode=json  
     I used the **Cypress intercept method for GET api**. Not only checked the response status code but also rendered the response data with two steps. First is showing `team title` and second is showing the `job postings`. 
3. Stubbing the response with mock data to display the Engineering team only.
   * In this test case, I create a custom json file to mock response data in the custom file, the name is `jobslist.json` under the fixture folder. It will include Engineering jobs only when the test case is executed.
   
#### In the applyqajob.feature.js file, I wrote two test cases _
1.   Search QA job
     * In this testcase, I used cy.intercept GET method and I want to retrieve this  “Automation Test Engineer (Cypress/Typescript)”position exactly. So, I used find() and strict equality.
     * When I click on this position, there is opening to a new tab. Actually, Cypress doesn’t support testing multiple tabs. So, I asserted the hosted url is matched with the right direction, target_blank  and other attributes. Here is my reference link https://filiphric.com/opening-a-new-tab-in-cypress?fbclid=IwAR1b_z9TznZvynT6Pz3wbKgFP6V8HbNfSbFB_5VLu3CQvPbdelL7J59Oteg
2.  Display QA role description & apply this job
     * In this test case,  i called directly hostedUrl which one is opening the new tab.
 https://jobs.lever.co/userlane/19b969e3-e406-486c-82e6-483f62fe597f
     * I checked the error message if the Fullname input is empty by using input:invalid.
     * I checked the error message if the email address is invalid. These validate message I reference from this link : https://glebbahmutov.com/blog/form-validation-in-cypress/?fbclid=IwAR2HK6Z1rFNWezVP_VnO8_V_0iGdsPBddVf7Eb9cIP4zs9RX4uQnSyLdqbY
     * I checked the error message if there doesn’t attach resume file (or) doesn’t pass hcaptcha. 
     * - To checked this error message, I filled out a mock sample candidate data and click on submit button. After that, I validate to see the error message 
     * Fill the data and click apply job.
     * - To attach the resume file,  I created a file folder and put my resume pdf file in this folder. Filled out a mock sample candidate data and followed some procedure to pass hcaptcha which is the most difficult part of testing. I explained more detail below section. 

	 Additional info : Actually, I want to use the cy.intercept (POST) method. But,
 When I was checking the network tab after submit the job manually, I didn’t see api called and network response. That’s why, I don’t use cy.intercept with POST method.
 
 ### Here is explaining “How do I bypass captchas in automation test run?”
 As I research and assumption about hcaptch, that **should not be part of the testing for QA automated test**. Because this is a third party service. It is not a platform feature. 
Especially, it should not be tested on the production environment. 
For the test environment, I suggest to hide this hcaptcha feature (or) it should use the `test key` provided from `hcaptcha.com for Integration testing`. **Dev team should be able to prepare for this by rendering hCaptcha with the test keys for testing environment**. So, when integration testing is run in the test environment, it will bypass easily.	 Here is reference link: _
https://docs.hcaptcha.com/#integration-testing-test-keys, 

But,for this “Apply QA job of userlane” testcase, I found the service called `2captcha` which is the third party online live service which includes human power bypass this hcaptcha. I paid some fee to buy this service.
This link is explaining how to bypass hCaptcha with their API and how is working step by step detail  : https://2captcha.com/blog/solve-hcaptcha, https://2captcha.com/2captcha-api#solving_hcaptcha

And I used [npm library 2captcha](https://www.npmjs.com/package/2captcha) for easier integration.











 

