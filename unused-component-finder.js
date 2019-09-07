// 1. Find all components where they are initialized in Angular typescript files. 
// 2. Take those components and loop through them to determine if they exist in any html files.
// 3. Add the results to an array of unused components. 

const findInFiles = require('find-in-files');
const rxjs = require('rxjs');
let allComponents = new rxjs.Subject();
let unusedComponents = new rxjs.Subject();

allComponents.subscribe(allComps => {
    findUnusedComponents(allComps);
})

unusedComponents.subscribe(unusedComps => {
    console.log("\x1b[34m", `There are ${unusedComps.length} unused components in your app. \n\n ${unusedComps}`);
})

findAllComponents();

function findAllComponents() {
    findInFiles.find("app-\.*-component", 'C:/Users/epg/Documents/codingProjects/angularTest/src', '.ts$')
        .then(results => {
            const allComps = [];
            for (var result in results) {
                allComps.push(results[result].matches[0])
            }
            allComponents.next(allComps);
        })
}

findUnusedComponents = (allComps) => {
    let unusedComps = allComps;
    allComps.forEach(component => {
        findInFiles.find(`${component}`, 'C:/Users/epg/Documents/codingProjects/angularTest/src', '.html$')
            .then(results => {
                for (var result in results) {
                    // filter out all of the components that were found, leaving us with only unused components.
                    unusedComps = unusedComps.filter(c => c !== results[result].matches[0]);
                    unusedComponents.next(unusedComps);
                }
            });
    });
}