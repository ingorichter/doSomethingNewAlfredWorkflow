const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://whats.new/shortcuts/', {waitUntil: 'networkidle2'});

  // Wait for the results page to load and display the results.
  const categoryHeaderSelector = '.data-table__content .data-table__title';
  await page.waitForSelector(categoryHeaderSelector);

  // Extract the results from the page.
  const serviceInfoJSON = await page.evaluate((categoryHeaderSelector) => {
    const categoryHeaders = Array.from(
      document.querySelectorAll(categoryHeaderSelector)
    );

    var serviceTables = Array.from(
      document.querySelectorAll('.data-table__table')
    );

    const serviceNames2Services = Object.assign({});
    categoryHeaders.forEach((categoryHeader, index) => {
      const title = categoryHeader.textContent.split('|')[0].trim();
      serviceNames2Services[categoryHeader.id] = Object.assign({
        categoryTitle: title,
        services: [],
      });

      const servicesTableRows = Array.from(
        serviceTables[index].querySelectorAll('tbody>.data-table__row')
      );

      servicesTableRows.forEach((serviceRow) => {
        // get all columns
        const columns = Array.from(serviceRow.querySelectorAll('td'));
        const serviceDetails = Object.assign({
          domain: columns[0].textContent
            .trim()
            .split(' ')
            .filter((x) => x.length > 0),
          company: columns[1].textContent.trim(),
          description: columns[2].textContent.trim(),
        });

        // add this to the mapping from category to services
        serviceNames2Services[categoryHeader.id].services.push(serviceDetails);
      });
    });

    return serviceNames2Services;
  }, categoryHeaderSelector);

  console.log(JSON.stringify(serviceInfoJSON));

  await browser.close();
})();
